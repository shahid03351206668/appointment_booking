# -*- coding: utf-8 -*-
# Copyright (c) 2020, Codes Soft and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class ClinicListFilters(Document):
	pass


	def before_insert(self):
		check = frappe.db.get_value("Clinic List Filters", {"owner": frappe.session.user, "filter_name": self.filter_name}, "name")
		if check: frappe.throw("Filter Name {} already exist.".format(self.filter_name))