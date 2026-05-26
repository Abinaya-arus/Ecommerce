import { ref, computed } from "vue"

const cartItems = ref(JSON.parse(localStorage.getItem("cart") || "[]"))

function save() {
	localStorage.setItem("cart", JSON.stringify(cartItems.value))
}

export function useCart() {
	function addToCart(product) {
		const existing = cartItems.value.find((i) => i.name === product.name)
		if (existing) {
			existing.quantity++
		} else {
			cartItems.value.push({
				name: product.name,
				price: product.price,
				currency: product.currency,
				preview_image: product.preview_image,
				quantity: 1,
			})
		}
		save()
	}

	function removeFromCart(name) {
		cartItems.value = cartItems.value.filter((i) => i.name !== name)
		save()
	}

	function updateQuantity(name, quantity) {
		const item = cartItems.value.find((i) => i.name === name)
		if (!item) return
		if (quantity <= 0) {
			removeFromCart(name)
		} else {
			item.quantity = quantity
			save()
		}
	}

	function clearCart() {
		cartItems.value = []
		save()
	}

	const cartCount = computed(() =>
		cartItems.value.reduce((sum, i) => sum + i.quantity, 0)
	)

	const cartTotal = computed(() =>
		cartItems.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
	)

	return { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }
}
