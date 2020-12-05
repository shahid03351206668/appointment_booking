# -*- coding: utf-8 -*-
# Copyright (c) 2020, Codes Soft and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.utils.selenium_testdriver import TestDriver

class Appointments(Document):
	pass

	# def onload(self):
	# 	user = frappe.session.user
	# 	roles = frappe.get_roles(user)
	# 	if "System Manager" not in roles:
	# 		if "InsurCoUsers" in roles:
	# 			if self.the_date_and_time_of_publication_of_the_record:
	# 				if frappe.utils.getdate(self.the_date_and_time_of_publication_of_the_record) >= frappe.utils.getdate(frappe.utils.now()):
	# 					# frappe.local.response["type"] = "redirect"
	# 					# frappe.local.response["location"] = "/desk#List/Appointments/List"
	# 					driver = TestDriver()
	# 					driver.set_route("Form", "Appointments")

	def validate(self):
		self.doctor_full_name = ""
		self.patient_full_name = ""

		if self.doctor_first_name:
			self.doctor_full_name += str(self.doctor_first_name).strip()
		if self.doctor_middle_name:
			self.doctor_full_name += " "+str(self.doctor_middle_name).strip()
		if self.doctor_last_name:
			self.doctor_full_name += " "+str(self.doctor_last_name).strip()
		if self.doctor_full_name:
			self.doctor_full_name = str(self.doctor_full_name).strip()

		if self.patient_first_name:
			self.patient_full_name += str(self.patient_first_name).strip()
		if self.patient_middle_name:
			self.patient_full_name += " "+str(self.patient_middle_name).strip()
		if self.patient_last_name:
			self.patient_full_name += " "+str(self.patient_last_name).strip()
		if self.doctor_full_name:
			self.patient_full_name = str(self.patient_full_name).strip()

		if self.phone:
			self.phone = str(self.phone).strip()

		if self.email:
			self.email = str(self.email).strip()

		if not self.clinic:
			self.clinic = frappe.db.get_value("User Permission", {"user": frappe.session.user, "allow": "Clinic"}, "for_value")
		if not self.clinic:
			frappe.throw("No Clinic is assigned to you, Please contact admin.")

		if self.patient_full_name:
			if not self.insurance_company:
				self.insurance_company = frappe.db.get_value("User Permission", {"user": frappe.session.user, "allow": "Insurance Company"}, "for_value")

		
			# user = frappe.get_doc("User", frappe.session.user)
			# for d in user.roles:
			# 	if d.role == "InsurCoUsers":
			# 		self.user_name_of_the_booking_manager = user.username
			# 		self.full_name_of_the_booking_manager = user.full_name
			# 		self.booking_modification_manager = frappe.session.user
			# 		break

		if self.status == "Booked":
			self.date_and_time_of_the_last_booking_modification = frappe.utils.now()

@frappe.whitelist()
def get_policies(name,phone = None,email = None):
	policy_number = None
	if phone:
		policy_number = frappe.db.get_value("Appointments", {"phone": phone, "name": ("!=", name)}, "policy_number")
	if not policy_number and email:
		policy_number = frappe.db.get_value("Appointments", {"email": email, "name": ("!=", name)}, "policy_number")

	policy_validity_date = None
	if phone:
		policy_validity_date = frappe.db.get_value("Appointments", {"phone": phone, "name": ("!=", name)}, "policy_validity_date")
	if not policy_number and email:
		policy_validity_date = frappe.db.get_value("Appointments", {"email": email, "name": ("!=", name)}, "policy_validity_date")

	return {"policy_number": policy_number, "policy_validity_date": policy_validity_date}

def get_permission_query_conditions_for_appointments(user = None):
	user = frappe.session.user
	roles = frappe.get_roles(user)
	query = "`tabAppointments`.name != 'asadaskdaskdaslalsa'"
	if "System Manager" not in roles:
		if "ClinicUsers" in roles:
			query+= """ and `tabAppointments`.status != 'Deleted'"""
		if "InsurCoUsers" in roles:
			# query+= """ and if(`tabAppointments`.the_date_and_time_of_publication_of_the_record, `tabAppointments`.the_date_and_time_of_publication_of_the_record <= '{}' , 'tabAppointments`.the_date_and_time_of_publication_of_the_record IS NULL')""".format(frappe.utils.now())
			query+= """ and (`tabAppointments`.the_date_and_time_of_publication_of_the_record IS NULL or `tabAppointments`.the_date_and_time_of_publication_of_the_record <= '{}')""".format(frappe.utils.now())
			query += " and `tabAppointments`.status = 'Booked'"


		return query