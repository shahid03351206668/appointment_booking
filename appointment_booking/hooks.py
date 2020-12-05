# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "appointment_booking"
app_title = "Appointment Booking"
app_publisher = "Codes Soft"
app_description = "Appontment Booking"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "shahid@codessoft.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/appointment_booking/css/appointment_booking.css"
# app_include_js = "/assets/appointment_booking/js/appointment_booking.js"

# include js, css files in header of web template
# web_include_css = "/assets/appointment_booking/css/appointment_booking.css"
# web_include_js = "/assets/appointment_booking/js/appointment_booking.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "appointment_booking.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "appointment_booking.install.before_install"
# after_install = "appointment_booking.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "appointment_booking.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

permission_query_conditions = {
	"Appointments": "appointment_booking.appointment_booking.doctype.appointments.appointments.get_permission_query_conditions_for_appointments"
}
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"appointment_booking.tasks.all"
# 	],
# 	"daily": [
# 		"appointment_booking.tasks.daily"
# 	],
# 	"hourly": [
# 		"appointment_booking.tasks.hourly"
# 	],
# 	"weekly": [
# 		"appointment_booking.tasks.weekly"
# 	]
# 	"monthly": [
# 		"appointment_booking.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "appointment_booking.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "appointment_booking.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "appointment_booking.task.get_dashboard_data"
# }

