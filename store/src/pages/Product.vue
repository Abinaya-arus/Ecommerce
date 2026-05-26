<template>
	<div class="min-h-screen bg-gray-50 p-8">
		<h1 class="text-3xl font-bold text-gray-800 mb-8">Products</h1>

		<div v-if="products.loading" class="flex items-center justify-center py-20">
			<LoadingIndicator class="w-8 h-8 text-blue-600" />
		</div>

		<div v-else-if="products.error" class="flex justify-center py-20">
			<ErrorMessage :message="products.error.message || String(products.error)" />
		</div>

		<div v-else-if="!products.data?.length" class="text-center py-20 text-gray-400">
			No products found.
		</div>

		<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			<div
				v-for="product in products.data"
				:key="product.name"
				@click="router.push('/product/' + encodeURIComponent(product.name))"
				class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
			>
				<div class="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
					<img
						v-if="product.preview_image"
						:src="product.preview_image"
						:alt="product.name"
						class="w-full h-full object-cover"
					/>
					<span v-else class="text-gray-300 text-5xl">🛍️</span>
				</div>

				<div class="p-4">
					<h2 class="text-lg font-semibold text-gray-800 truncate">{{ product.name }}</h2>

					<p class="mt-1 text-gray-500 text-sm line-clamp-2">
						{{ stripMarkdown(product.product_description) }}
					</p>

					<div class="mt-3">
						<span class="text-xl font-bold text-blue-600">
							{{ formatPrice(product.price, product.currency) }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router"
import { createResource, LoadingIndicator } from "frappe-ui"

const router = useRouter()

const products = createResource({
	url: "frappe.client.get_list",
	method: "GET",
	params: {
		doctype: "Product",
		fields: JSON.stringify(["name", "price", "currency", "preview_image", "product_description"]),
		limit_page_length: 100,
		order_by: "creation desc",
	},
	auto: true,
})

function formatPrice(price, currency) {
	if (!price) return "0.00"
	return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "INR" }).format(price)
}

function stripMarkdown(text) {
	if (!text) return ""
	return text.replace(/[#*_`~>\[\]!]/g, "").trim()
}
</script>
