import json
import frappe
from frappe import _


@frappe.whitelist()
def place_order(items):
	if isinstance(items, str):
		items = json.loads(items)

	if not items:
		frappe.throw(_("Cart is empty"))

	if frappe.session.user == "Guest":
		frappe.throw(_("Please log in to place an order"))

	order = frappe.new_doc("Orders")
	order.customer = frappe.session.user
	order.status = "Placed"

	for item in items:
		order.append("item", {
			"product": item.get("name"),
			"qty": item.get("quantity", 1),
		})

	order.insert(ignore_permissions=True)
	frappe.db.commit()

	return order.name
