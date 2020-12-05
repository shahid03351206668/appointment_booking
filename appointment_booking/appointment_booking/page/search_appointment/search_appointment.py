import frappe
from frappe.utils import getdate, now, nowdate
from datetime import date, datetime, timedelta
import json
import dateutil.relativedelta
from frappe.desk.reportview import build_match_conditions

	
@frappe.whitelist()
def get_table_data(filters):
	filters = json.loads(filters)
	argu = filters.get("active")
	out = {}

	output = ""
	background = "maroon"

	conditions = ""
	add_cond = ""

	user = frappe.session.user
	roles = frappe.get_roles(user)
	if "System Manager" not in roles and "InsurCoUsers" in roles:
		add_cond += """ and (the_date_and_time_of_publication_of_the_record IS NULL or the_date_and_time_of_publication_of_the_record <= '{}')""".format(frappe.utils.now())
		companies = frappe.db.sql("select for_value from `tabUser Permission` where user = '{}' and allow = 'Insurance Company'".format(frappe.session.user))
		if companies:
			for c in companies:
				add_cond += " and (insurance_company = '{}' or insurance_company IS NULL)".format(c[0])

	# match_conditions = build_match_conditions("Appointments")
	# if match_conditions:
	# 	add_cond += " and %s" % match_conditions

	if filters.get("visibility_from"):
		add_cond += " and visit_date >= '{}'".format(getdate(filters.get("visibility_from")))
	# else:
	# 	add_cond += " and visit_date >= '{}'".format(getdate(nowdate()))
	if filters.get("visibility_to"):
		add_cond += " and visit_date <= '{}'".format(getdate(filters.get("visibility_to")))
	# else:
	# 	add_cond += " and visit_date <= '{}'".format(getdate(nowdate()) + timedelta(days=7))
	if filters.get("app_id"):
		add_cond += " and name = '{}'".format(filters.get("app_id"))
	if filters.get("clinic_list"):
		clinics = ["abc","abc2"]
		doc = frappe.get_doc("Clinic List Filters", {"owner": frappe.session.user, "filter_name": filters.get("clinic_list")})
		for d in doc.clinics:
			clinics.append(d.clinic)
		add_cond += " and clinic IN {}".format(tuple(clinics))
	elif filters.get("clinic_filter"):
		add_cond += " and clinic = '{}'".format(filters.get("clinic_filter"))
	if filters.get("doctor_full_name"):
		add_cond += " and doctor_full_name like '%%{}%%'".format(filters.get("doctor_full_name"))
	if filters.get("patient_full_name"):
		add_cond += " and patient_full_name like '%%{}%%'".format(filters.get("patient_full_name"))

	output += """<tr>
			<th style="background-color:{0};">
    			Sr.
    		</th>
    		<th style="background-color:{0};">
    			Clinic
    		</th>
    		<th style="background-color:{0};">
    			Free Appointments
    		</th>
		</tr>""".format(background)
	sr=0
	query = """select clinic,count(name) from `tabAppointments` where status = 'Available' 
				{}
			""".format(add_cond)

	if filters.get("clinic_search"): query+= " and clinic like '%%{}%%'".format(filters.get("clinic_search"))
	query += " group by 1 order by 1 limit {}".format(filters.get("clinic_limit"))

	query = frappe.db.sql(query)
	if query:
		for d in query:
			sr+=1
			output += """
				<tr>
					<td>{sr}</td>
					<td><b style="cursor:pointer;" class="clinic_select" data-datatype='{groups}'>{groups}</b></td>
					<td>{count}</td>
				</tr>
			""".format(sr=sr, groups=d[0], count=d[1])
	else:
		output += """
				<tr>
					<td colspan=2>No Data</td>
				</tr>
		"""
	out["clinic"] = output


	output = ""
	output += """<tr>
			<th style="background-color:{0};">
    			Sr.
    		</th>
    		<th style="background-color:{0};">
    			Specialist (Service)
    		</th>
    		<th style="background-color:{0};">
    			Free Appointments
    		</th>
		</tr>""".format(background)
	sr=0
	query = """select specialty,count(name) from `tabAppointments` where status = 'Available' 
				{}
			""".format(add_cond)

	if filters.get("clinic"): query+= " and clinic = '{}'".format(filters.get("clinic"))
	if filters.get("specialist_search"): query+= " and specialty like '%%{}%%'".format(filters.get("specialist_search"))
	query += " group by 1 order by 1 limit {}".format(filters.get("specialist_limit"))

	query = frappe.db.sql(query)
	if query:
		for d in query:
			sr+=1
			output += """
				<tr>
					<td>{sr}</td>
					<td><b style="cursor:pointer;" class="specialist_select" data-datatype='{groups}'>{groups}</b></td>
					<td>{count}</td>
				</tr>
			""".format(sr=sr, groups=d[0], count=d[1])
	else:
		output += """
				<tr>
					<td colspan=2>No Data</td>
				</tr>
		"""
	out["specialist"] = output


	output = ""
	output += """<tr>
			<th style="background-color:{0};">
    			Sr.
    		</th>
    		<th style="background-color:{0};">
    			Doctor
    		</th>
    		<th style="background-color:{0};">
    			Free Appointments
    		</th>
		</tr>""".format(background)
	sr=0
	query = """select doctor_full_name,count(name) from `tabAppointments` where status = 'Available' 
			{}
			""".format(add_cond)

	if filters.get("clinic"): query+= " and clinic = '{}'".format(filters.get("clinic"))
	if filters.get("specialist"): query+= " and specialty = '{}'".format(filters.get("specialist"))
	if filters.get("doctor_search"): query+= " and doctor_full_name like '%%{}%%'".format(filters.get("doctor_search"))
	query += " group by 1 order by 1 limit {}".format(filters.get("doctor_limit"))

	query = frappe.db.sql(query)
	if query:
		for d in query:
			sr+=1
			output += """
				<tr>
					<td>{sr}</td>
					<td><b style="cursor:pointer;" class="doctor_select" data-datatype='{groups}'>{groups}</b></td>
					<td>{count}</td>
				</tr>
			""".format(sr=sr, groups=d[0], count=d[1])
	else:
		output += """
				<tr>
					<td colspan=2>No Data</td>
				</tr>
		"""
	out["doctor"] = output


	output = ""
	output += """<tr>
			<th style="background-color:{0};">
    			Sr.
    		</th>
    		<th style="background-color:{0};">
    			Date
    		</th>
    		<th style="background-color:{0};">
    			Free Appointments
    		</th>
		</tr>""".format(background)
	sr=0
	query = """select visit_date,count(name) from `tabAppointments` where status = 'Available' 
			{}
			""".format(add_cond)

	if filters.get("clinic"): query+= " and clinic = '{}'".format(filters.get("clinic"))
	if filters.get("specialist"): query+= " and specialty = '{}'".format(filters.get("specialist"))
	if filters.get("doctor"): query+= " and doctor_full_name = '{}'".format(filters.get("doctor"))
	if filters.get("date_search"):
		date = str(filters.get("date_search")).split(".")
		new_date = date[2]+"-"+date[1]+"-"+date[0]
		query+= " and visit_date = '{}'".format(new_date)
	query += " group by 1 order by 1 limit {}".format(filters.get("date_limit"))

	query = frappe.db.sql(query)
	if query:
		for d in query:
			sr+=1
			if d[0]:
				date = frappe.utils.getdate(d[0])
				new_date = str(date.day)+"."+str(date.month)+"."+str(date.year)
				output += """
					<tr>
						<td>{sr}</td>
						<td><b style="cursor:pointer;" class="date_select" data-datatype='{groups}'>{groups}</b></td>
						<td>{count}</td>
					</tr>
				""".format(sr=sr, groups=new_date, count=d[1])
	else:
		output += """
				<tr>
					<td colspan=2>No Data</td>
				</tr>
		"""
	out["date"] = output


	output = ""
	output += """<tr>
			<th style="background-color:{0};">
    			Sr.
    		</th>
    		<th style="background-color:{0};">
    			Time
    		</th>
		</tr>""".format(background)
	sr=0
	query = """select visit_time,name from `tabAppointments` where status = 'Available' 
			{}
			""".format(add_cond)

	if filters.get("clinic"): query+= " and clinic = '{}'".format(filters.get("clinic"))
	if filters.get("specialist"): query+= " and specialty = '{}'".format(filters.get("specialist"))
	if filters.get("doctor"): query+= " and doctor_full_name = '{}'".format(filters.get("doctor"))
	# frappe.throw(str(frappe.utils.getdate(filters.get("date"))))
	if filters.get("date"):
		date = str(filters.get("date")).split(".")
		new_date = date[2]+"-"+date[1]+"-"+date[0]
		query+= " and visit_date = '{}'".format(new_date)
	query += " order by 1 limit {}".format(filters.get("time_limit"))

	query = frappe.db.sql(query)
	if query:
		for d in query:
			sr+=1
			output += """
				<tr>
					<td>{sr}</td>
					<td><b style="cursor:pointer;" class="time_select" data-datatype='{groups}' data-name='{name}'>{groups}</b></td>
				</tr>
			""".format(sr=sr, groups=d[0], name=d[1])
	else:
		output += """
				<tr>
					<td colspan=2>No Data</td>
				</tr>
		"""
	out["time"] = output
	return out


@frappe.whitelist()
def insert_filter(filter_name, filters):
	filters = json.loads(filters)
	check = frappe.db.get_value("User Filters", {"user": frappe.session.user, "filter_name": filter_name}, "name")
	if check:
		frappe.throw("Filter {} already exist.".format(str(filter_name)))
	doc = frappe.new_doc("User Filters")
	doc.user = frappe.session.user
	doc.filter_name = filter_name
	doc.user_filters_detail = []
	allowed = ["app_id", "clinic_filter", "doctor_full_name", "patient_full_name"]
	for i,j in filters.items():
		if i in allowed:
			doc.append("user_filters_detail", {
					"filter_key": i,
					"filter_value": j
				})
	if doc.user_filters_detail:
		doc.insert(ignore_permissions=True)
		return doc

@frappe.whitelist()
def update_filter(filter_name, filters):
	filters = json.loads(filters)
	doc = frappe.get_doc("User Filters", {"user": frappe.session.user, "filter_name": filter_name})
	doc.user_filters_detail = []
	allowed = ["app_id", "clinic", "doctor_full_name", "patient_full_name"]
	for i,j in filters.items():
		if i in allowed:
			doc.append("user_filters_detail", {
					"filter_key": i,
					"filter_value": j
				})
	if doc.user_filters_detail:
		doc.save(ignore_permissions=True)
		return doc

@frappe.whitelist()
def get_user_filters():
	filters = [""]
	data = frappe.db.sql("select filter_name from `tabUser Filters` where user = %s",(frappe.session.user))
	for d in data:
		filters.append(d[0])
	return filters


@frappe.whitelist()
def get_filter_values(filter_name):
	dic = {}
	doc = frappe.get_doc("User Filters", {"user": frappe.session.user, "filter_name": filter_name})
	for d in doc.user_filters_detail:
		dic[d.filter_key] = d.filter_value
	return dic


@frappe.whitelist()
def get_clinic_filters():
	filters = [""]
	data = frappe.db.sql("select filter_name from `tabClinic List Filters` where owner = %s",(frappe.session.user))
	for d in data:
		filters.append(d[0])
	return filters

@frappe.whitelist()
def get_filter_clinic(filter_name):
	dic = ""
	count = 0
	doc = frappe.get_doc("Clinic List Filters", {"owner": frappe.session.user, "filter_name": filter_name})
	for d in doc.clinics:
		if count == 0:
			dic += d.clinic
		else:
			dic += " -OR- "+d.clinic
		count += 1
	return dic