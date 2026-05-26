import { userResource } from "@/data/user";
import { createRouter, createWebHistory } from "vue-router";
import { session } from "./data/session";

const routes = [
	{
		path: "/",
		name: "Home",
		component: () => import("@/pages/Home.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/product",
		name: "Product",
		component: () => import("@/pages/Product.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/product/:name",
		name: "ProductDetail",
		component: () => import("@/pages/ProductDetail.vue"),
		meta: { requiresAuth: true },
	},
	{
		path: "/cart",
		name: "Cart",
		component: () => import("@/pages/Cart.vue"),
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory("/store"),
	routes,
});

router.beforeEach(async (to, from, next) => {
	let isLoggedIn = session.isLoggedIn;
	try {
		await userResource.promise;
	} catch (error) {
		isLoggedIn = false;
	}
	if (to.meta.requiresAuth && !isLoggedIn) {
		window.location.href = "/login?redirect-to=/store";
		return;
	}
	next();
});

export default router;
