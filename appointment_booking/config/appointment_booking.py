from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Employee"),
			"items": [
				{
					"type": "doctype",
					"name": "Appointments",
					"onboard": 1,
				},
				{
					"type": "page",
					"name": "search-appointment",
					"label": "Search for Open Book Appointment",
					"onboard": 1,
				},
				{
					"type": "doctype",
					"name": "Clinic",
				},
				{
					"type": "doctype",
					"name": "Insurance Company",
				},
				{
					"type": "doctype",
					"name": "User Permission",
				}
			]
		}
	]
