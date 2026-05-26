<template>
	<div class="min-h-screen bg-white p-8">

		<div v-if="product.get.loading" class="flex items-center justify-center py-20">
			<LoadingIndicator class="w-8 h-8 text-blue-600" />
		</div>

		<div v-else-if="product.get.error" class="flex justify-center py-20">
			<ErrorMessage :message="product.get.error.message || String(product.get.error)" />
		</div>

		<div v-else-if="product.doc" class="max-w-6xl mx-auto">

			<Button variant="ghost" icon-left="arrow-left" @click="router.push('/product')" class="mb-6">
				Back to Products
			</Button>

			<div class="flex flex-col md:flex-row gap-10">

				<!-- Left: Product Info -->
				<div class="md:w-1/2 flex flex-col gap-4">
					<h1 class="text-3xl font-bold text-gray-800">{{ product.doc.name }}</h1>

					<p class="text-2xl font-bold text-blue-600">
						{{ formatPrice(product.doc.price, product.doc.currency) }}
					</p>

					<Button
						variant="solid"
						theme="blue"
						icon-left="shopping-cart"
						:label="added ? 'Added!' : 'Add to Cart'"
						@click="handleAddToCart"
						class="w-fit"
					/>

					<div
						class="text-gray-600 leading-relaxed"
						v-html="descriptionHtml"
					></div>
				</div>

				<!-- Right: Image Gallery -->
				<div class="md:w-1/2 flex gap-3">

					<!-- Thumbnails -->
					<div class="flex flex-col gap-2">
						<img
							v-for="(img, index) in allImages"
							:key="index"
							:src="img"
							@click="selectedImage = img"
							class="w-16 h-16 object-cover rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity"
							:class="selectedImage === img ? 'border-blue-500' : 'border-gray-200'"
						/>
					</div>

					<!-- Main Image -->
					<div class="flex-1">
						<img
							v-if="selectedImage"
							:src="selectedImage"
							@click="showLightbox = true"
							class="w-full h-96 object-contain rounded-2xl bg-gray-50 cursor-zoom-in border border-gray-100"
						/>
						<div
							v-else
							class="w-full h-96 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-7xl"
						>
							🛍️
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Lightbox -->
		<div
			v-if="showLightbox"
			class="fixed inset-0 bg-black bg-opacity-85 z-50 flex items-center justify-center"
			@click="showLightbox = false"
		>
			<img
				:src="selectedImage"
				class="max-w-4xl max-h-screen object-contain rounded-xl"
				@click.stop
			/>
			<Button
				variant="ghost"
				icon="x"
				@click="showLightbox = false"
				class="absolute top-5 right-6 text-white"
			/>
		</div>

	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { createDocumentResource, LoadingIndicator } from "frappe-ui"
import showdown from "showdown"
import { useCart } from "@/data/cart"

const route = useRoute()
const router = useRouter()
const showLightbox = ref(false)
const selectedImage = ref(null)
const added = ref(false)
const converter = new showdown.Converter()
const { addToCart } = useCart()

function handleAddToCart() {
	addToCart(product.doc)
	added.value = true
	setTimeout(() => (added.value = false), 1500)
}

const product = createDocumentResource({
	doctype: "Product",
	name: decodeURIComponent(route.params.name),
})

const allImages = computed(() => {
	if (!product.doc) return []
	const imgs = []
	if (product.doc.preview_image) imgs.push(product.doc.preview_image)
	if (product.doc.images) {
		product.doc.images.forEach((img) => {
			if (img.image_url) imgs.push(img.image_url)
		})
	}
	return imgs
})

watch(allImages, (imgs) => {
	if (imgs.length && !selectedImage.value) {
		selectedImage.value = imgs[0]
	}
}, { immediate: true })

const descriptionHtml = computed(() => {
	if (!product.doc?.product_description) return ""
	return converter.makeHtml(product.doc.product_description)
})

function formatPrice(price, currency) {
	if (!price) return "0.00"
	return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "INR" }).format(price)
}
</script>
