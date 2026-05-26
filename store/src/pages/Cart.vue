<template>
	<div class="min-h-screen bg-gray-50 p-8">
		<template v-if="!showSuccess">
			<h1 class="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>

			<div v-if="!cartItems.length" class="text-center py-20 text-gray-400">
				<FeatherIcon name="shopping-cart" class="w-16 h-16 mx-auto mb-4 opacity-30" />
				<p class="text-lg">Your cart is empty</p>
				<Button variant="ghost" icon-left="arrow-left" @click="router.push('/product')" class="mt-4">
					Continue Shopping
				</Button>
			</div>

			<div v-else class="max-w-3xl mx-auto flex flex-col gap-4">
				<div
					v-for="item in cartItems"
					:key="item.name"
					class="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm"
				>
					<img
						v-if="item.preview_image"
						:src="item.preview_image"
						class="w-20 h-20 object-cover rounded-xl"
					/>
					<div v-else class="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">🛍️</div>

					<div class="flex-1">
						<h2 class="font-semibold text-gray-800">{{ item.name }}</h2>
						<p class="text-blue-600 font-bold mt-1">{{ formatPrice(item.price, item.currency) }}</p>
					</div>

					<div class="flex items-center gap-2">
						<button
							@click="updateQuantity(item.name, item.quantity - 1)"
							class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
						>−</button>
						<span class="w-6 text-center font-semibold">{{ item.quantity }}</span>
						<button
							@click="updateQuantity(item.name, item.quantity + 1)"
							class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg font-bold"
						>+</button>
					</div>

					<Button variant="ghost" theme="red" icon="trash-2" @click="removeFromCart(item.name)" />
				</div>

				<div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-2">
					<div class="flex justify-between items-center text-lg font-bold text-gray-800">
						<span>Total</span>
						<span class="text-blue-600">{{ formatTotal }}</span>
					</div>
					<Button
						variant="solid"
						theme="blue"
						:loading="ordering"
						loading-text="Placing Order..."
						label="Place Order"
						@click="placeOrder"
						class="mt-4 w-full"
					/>
					<Button
						variant="ghost"
						icon-left="arrow-left"
						@click="router.push('/product')"
						class="mt-2 w-full"
					>
						Continue Shopping
					</Button>
				</div>
			</div>
		</template>
	</div>

	<!-- Order Success Modal -->
	<Teleport to="body">
		<div v-if="showSuccess" class="fixed inset-0 z-50 flex items-center justify-center">
			<div class="absolute inset-0 bg-black/50" @click="showSuccess = false" />
			<div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-5 text-center">
				<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
					<FeatherIcon name="check-circle" class="w-9 h-9 text-green-500" />
				</div>
				<div>
					<h2 class="text-xl font-bold text-gray-900">Order Placed!</h2>
					<p class="text-gray-500 text-sm mt-1">Your order has been placed successfully.</p>
				</div>
				<div class="bg-gray-50 rounded-xl w-full py-3 px-4">
					<p class="text-xs text-gray-400 uppercase tracking-widest">Order ID</p>
					<p class="text-2xl font-bold text-gray-800 mt-1">{{ placedOrderName }}</p>
				</div>
				<button
					@click="() => { showSuccess = false; router.push('/product') }"
					class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
				>
					Continue Shopping
				</button>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { FeatherIcon, call } from "frappe-ui"
import { useCart } from "@/data/cart"

const router = useRouter()
const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart()
const ordering = ref(false)
const showSuccess = ref(false)
const placedOrderName = ref("")

async function placeOrder() {
	ordering.value = true
	try {
		const orderName = await call("ecom.ecom.api.place_order", {
			items: JSON.stringify(cartItems.value),
		})
		placedOrderName.value = orderName
		clearCart()
		showSuccess.value = true
	} catch (e) {
		alert(e.messages?.join("\n") || e.message || "Failed to place order")
	} finally {
		ordering.value = false
	}
}

const formatTotal = computed(() => {
	if (!cartItems.value.length) return "0.00"
	const currency = cartItems.value[0].currency || "INR"
	return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(cartTotal.value)
})

function formatPrice(price, currency) {
	if (!price) return "0.00"
	return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "INR" }).format(price)
}
</script>
