<template>
	<div>
		<nav class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-40">
			<span
				@click="router.push('/product')"
				class="text-xl font-bold text-gray-800 cursor-pointer"
			>
				🛍️ Store
			</span>

			<button
				@click="router.push('/cart')"
				class="relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
			>
				<FeatherIcon name="shopping-cart" class="w-6 h-6" />
				<span
					v-if="cartCount > 0"
					class="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
				>
					{{ cartCount }}
				</span>
			</button>
		</nav>

		<router-view />
	</div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { FeatherIcon } from "frappe-ui"
import { useCart } from "@/data/cart"

const router = useRouter()
const { cartCount } = useCart()
</script>
