frappe.ui.form.on('Appointments', {
    doctor_first_name(frm){
        form_doctor_name(frm);
    },
    doctor_middle_name(frm){
        form_doctor_name(frm);
    },
    doctor_last_name(frm){
        form_doctor_name(frm);
    },
    patient_first_name(frm){
        form_patient_name(frm);
    },
    patient_middle_name(frm){
        form_patient_name(frm);
    },
    patient_last_name(frm){
        form_patient_name(frm);
    },
    validate(frm){
        if(frappe.session.user == "Administrator"){
            frappe.throw("Don't edit this document by Administrator User.")
        }
        if(frappe.user.has_role("InsurCoUsers") && frappe.user.has_role("BookingManagers")){
            frappe.throw("You have Two related roles in (InsurCoUsers, BookingManagers), must have only one role to avoid conflictions.");
        }
        else if(frappe.user.has_role("InsurCoUsers") && frappe.user.has_role("ClinicUsers")){
            frappe.throw("You have Two related roles in (InsurCoUsers, ClinicUsers), must have only one role to avoid conflictions.");
        }
        else if(frappe.user.has_role("ClinicUsers") && frappe.user.has_role("BookingManagers")){
            frappe.throw("You have Two related roles in (ClinicUsers, BookingManagers), must have only one role to avoid conflictions.");
        }
        if(frappe.user.has_role("InsurCoUsers")){
            if(frm.doc.status == "Available"){
                if(frm.doc.agreement_on_the_processing_of_personal_data){
                    frm.set_value("status", "Booked");
                }
                else{
                    frappe.throw("Agreement on the processing of personal data must be checked!")
                }
            }
        }
        frm.set_value("user_updated", frappe.user_info().fullname);
        frm.set_value("datetime_updated", frappe.datetime.get_today()+" "+frappe.datetime.now_time());
        
        if(!frm.doc.user_created){
            frm.set_value("user_created", frappe.user_info().fullname);
            frm.set_value("datetime_created", frappe.datetime.get_today()+" "+frappe.datetime.now_time());
        }
    },
	status(frm) {
		if(frm.doc.status == "Booked"){
		    frm.set_value("date_and_time_of_booking", frappe.datetime.get_today()+" "+frappe.datetime.now_time());
		    if(frappe.user.has_role("InsurCoUsers")){
		        frm.toggle_reqd("patient_first_name", true);
    	        frm.toggle_reqd("patient_middle_name", true);
    	        frm.toggle_reqd("patient_last_name", true);
    	        frm.toggle_reqd("date_of_birth", true);
    	        frm.toggle_reqd("policy_number", true);
    	        frm.toggle_reqd("policy_validity_date", true);
    	        frm.toggle_reqd("phone", true);
    	        frm.toggle_reqd("agreement_on_the_processing_of_personal_data", true);
		    }
		    else{
		        frm.toggle_reqd("patient_first_name", false);
    	        frm.toggle_reqd("patient_middle_name", false);
    	        frm.toggle_reqd("patient_last_name", false);
    	        frm.toggle_reqd("date_of_birth", false);
    	        frm.toggle_reqd("policy_number", false);
    	        frm.toggle_reqd("policy_validity_date", false);
    	        frm.toggle_reqd("phone", false);
    	        frm.toggle_reqd("agreement_on_the_processing_of_personal_data", false);
		    }
		}
	},
	agreement_on_the_processing_of_personal_data(frm){
	    if(frm.doc.agreement_on_the_processing_of_personal_data == 1){
	        frm.set_value("date_and_time_of_the_personal_data_processing_agreement", frappe.datetime.get_today()+" "+frappe.datetime.now_time());
	        frm.set_value("the_user_agreement", frappe.session.user_fullname);
	    }
	},
	email(frm){
	    if(frm.doc.email){
            frappe.call({
                method:"appointment_booking.appointment_booking.doctype.appointments.appointments.get_policies",
                args:{'name':frm.doc.name,'email':frm.doc.email},
                callback:function(r){
                    if(r.message){
                        if(!frm.doc.policy_number){
                            frm.set_value("policy_number",r.message.policy_number);
                        }
                        if(!frm.doc.policy_validity_date){
                            frm.set_value("policy_validity_date",r.message.policy_validity_date);
                        }
                    }
                }
            })
	    }
	},
	phone(frm){
	    if(frm.doc.phone){
            frappe.call({
                method:"appointment_booking.appointment_booking.doctype.appointments.appointments.get_policies",
                args:{'name':frm.doc.name,'phone':frm.doc.phone},
                callback:function(r){
                    if(r.message){
                        if(!frm.doc.policy_number){
                            frm.set_value("policy_number",r.message.policy_number);
                        }
                        if(!frm.doc.policy_validity_date){
                            frm.set_value("policy_validity_date",r.message.policy_validity_date);
                        }
                    }
                }
            })
	    }
	},
	refresh(frm){
	   // frm.set_value("insurance_company", "Insurance Vostok co.");
	   // frm.set_value("clinic", "My Clinic");
	    if(frm.doc.__islocal){
	        frm.toggle_display("patient_details_section", false);
	        frm.toggle_display("booking_manager_details_section", false);
	    }
	    else{
	        frm.toggle_display("patient_details_section", true);
	        frm.toggle_display("booking_manager_details_section", true);
	    }
	    
	    if(frappe.user.has_role("BookingManagers")){
	        frm.toggle_display("the_date_and_time_of_publication_of_the_record", true);
	        frm.toggle_display("code_from_the_external_system", true);
	        frm.toggle_enable("code_from_the_external_system", true);
	        frm.toggle_display("backup_version", true);
	        frm.toggle_enable("specialty", true);
	        frm.toggle_enable("visit_date", true);
	        frm.toggle_enable("visit_time", true);
	        frm.toggle_enable("duration_of_the_visit", true);
	        frm.toggle_display("doctor_first_name", true);
	        frm.toggle_display("doctor_middle_name", true);
	        frm.toggle_display("doctor_last_name", true);
	        frm.toggle_enable("note_to_a_patient", true);
	        frm.toggle_enable("status", true);
	        frm.toggle_display("patient_first_name", true);
	        frm.toggle_display("patient_middle_name", true);
	        frm.toggle_display("patient_last_name", true);
	        frm.toggle_enable("date_of_birth", true);
	        frm.toggle_enable("policy_number", true);
	        frm.toggle_enable("policy_validity_date", true);
	        frm.toggle_display("user_name_of_the_booking_manager", true);
	        frm.toggle_enable("phone", true);
	        frm.toggle_enable("email", true);
	        frm.toggle_enable("the_reasons_of_the_visit", true);
	        frm.toggle_enable("note_to_booking", true);
	        frm.toggle_enable("agreement_on_the_processing_of_personal_data", false);
	        frm.toggle_display("agreement_on_the_processing_of_personal_data", true);
	        frm.toggle_display("date_and_time_of_the_personal_data_processing_agreement", true);
	        frm.toggle_display("the_user_agreement", true);
	    }
	    else if(frappe.user.has_role("ClinicUsers")){
	        
	        if(frm.doc.status == "Hold"){
    	        frm.add_custom_button(__("Publish"), function() {
                    frm.set_value("status", "Available");
                    frm.set_value("the_date_and_time_of_publication_of_the_record", frappe.datetime.get_today()+" "+frappe.datetime.now_time());
                    frm.save();
            	}).addClass('btn-success');
	        }
	        else if(frm.doc.status == "Available"){
	            frm.add_custom_button(__("Hold"), function() {
                    frm.set_value("status", "Hold");
                    frm.save();
            	}).addClass('btn-warning');
	        }
	        
	        if(frm.doc.status == "Available" || frm.doc.status == "Hold"){
	            frm.add_custom_button(__("Delete"), function() {
                    frm.set_value("status", "Deleted");
                    frm.save();
            	}).addClass('btn-danger');
	        }
	        
	        $(".layout-side-section .form-sidebar .modified-by").css("display", "none");
	        $(".form-footer").css("display", "none");
	        
	        frm.toggle_display("user_created", true);
	        frm.toggle_display("datetime_created", true);
	        frm.toggle_display("user_updated", false);
	        frm.toggle_display("datetime_updated", false);
	        
	        frm.toggle_display("the_date_and_time_of_publication_of_the_record", true);
	        frm.toggle_display("code_from_the_external_system", true);
	        frm.toggle_enable("code_from_the_external_system", false);
	        frm.toggle_display("backup_version", false);
	        frm.toggle_enable("specialty", true);
	        frm.toggle_enable("visit_date", true);
	        frm.toggle_enable("visit_time", true);
	        frm.toggle_enable("duration_of_the_visit", true);
	        frm.toggle_display("doctor_first_name", true);
	        frm.toggle_display("doctor_middle_name", true);
	        frm.toggle_display("doctor_last_name", true);
	        frm.toggle_enable("note_to_a_patient", true);
	        frm.toggle_enable("status", false);
	        frm.toggle_display("patient_first_name", false);
	        frm.toggle_display("patient_middle_name", false);
	        frm.toggle_display("patient_last_name", false);
	        frm.toggle_enable("date_of_birth", false);
	        frm.toggle_enable("policy_number", false);
	        frm.toggle_enable("policy_validity_date", false);
	        frm.toggle_display("user_name_of_the_booking_manager", true);
	        frm.toggle_enable("phone", false);
	        frm.toggle_enable("email", false);
	        frm.toggle_enable("the_reasons_of_the_visit", false);
	        frm.toggle_enable("note_to_booking", false);
	        frm.toggle_enable("agreement_on_the_processing_of_personal_data", false);
	        frm.toggle_display("agreement_on_the_processing_of_personal_data", true);
	        frm.toggle_display("date_and_time_of_the_personal_data_processing_agreement", true);
	        frm.toggle_display("the_user_agreement", true);
	        
	    }
	    else if(frappe.user.has_role("InsurCoUsers")){
	        
	        if(frm.doc.the_date_and_time_of_publication_of_the_record){
	            console.log("there");
	            var now = frappe.datetime.get_today()+" "+frappe.datetime.now_time();
	            var d = frm.doc.the_date_and_time_of_publication_of_the_record;
	            now = new Date(now);
	            d = new Date(d);
    	        if(d >= now){
    	            console.log("there2");
    	            frappe.set_route("List", "Appointments");
    	        }
    	    }
    	    if(frm.doc.status == "Available"){
        	    frm.set_value("user_name_of_the_booking_manager", frappe.user_info().username);
        	    frm.set_value("full_name_of_the_booking_manager", frappe.user_info().fullname);
        	    frm.set_value("booking_modification_manager", frappe.session.user);
    	    }
	        
	        if(frm.doc.status == "Booked"){
    	        frm.add_custom_button(__("Cancel"), function() {
    	            frm.toggle_reqd("patient_first_name", false);
        	        frm.toggle_reqd("patient_middle_name", false);
        	        frm.toggle_reqd("patient_last_name", false);
        	        frm.toggle_reqd("date_of_birth", false);
        	        frm.toggle_reqd("policy_number", false);
        	        frm.toggle_reqd("policy_validity_date", false);
        	        frm.toggle_reqd("phone", false);
        	        frm.toggle_reqd("agreement_on_the_processing_of_personal_data", false);
        	        
                    frm.set_value("status", "Available");
                    frm.set_value("patient_first_name", "");
                    frm.set_value("patient_middle_name", "");
                    frm.set_value("patient_last_name", "");
                    frm.set_value("patient_full_name", "");
                    frm.set_value("date_of_birth", "");
                    frm.set_value("insurance_company", "");
                    frm.set_value("policy_number", "");
                    frm.set_value("policy_validity_date", "");
                    frm.set_value("user_name_of_the_booking_manager", "");
                    frm.set_value("phone", "");
                    frm.set_value("email", "");
                    frm.set_value("date_and_time_of_booking", "");
                    frm.set_value("the_reasons_of_the_visit", "");
                    frm.set_value("note_to_booking", "");
                    frm.set_value("agreement_on_the_processing_of_personal_data", 0);
                    frm.set_value("date_and_time_of_the_personal_data_processing_agreement", "");
                    frm.set_value("the_user_agreement", "");
                    frm.save();
            	}).addClass('btn-danger');
	        }
	        
	        $(".layout-side-section .form-sidebar .modified-by").css("display", "none");
	        $(".layout-side-section .form-sidebar .created-by").css("display", "none");
	        $(".form-footer").css("display", "none");
	        
	        
	        frm.toggle_display("creation_and_modifications_section", false);
	        frm.toggle_display("the_date_and_time_of_publication_of_the_record", false);
	        frm.toggle_display("code_from_the_external_system", false);
	        frm.toggle_enable("code_from_the_external_system", false);
	        frm.toggle_display("backup_version", false);
	        frm.toggle_enable("specialty", false);
	        frm.toggle_enable("visit_date", false);
	        frm.toggle_enable("visit_time", false);
	        frm.toggle_enable("duration_of_the_visit", false);
	        frm.toggle_display("doctor_first_name", false);
	        frm.toggle_display("doctor_middle_name", false);
	        frm.toggle_display("doctor_last_name", false);
	        frm.toggle_enable("note_to_a_patient", false);
	        frm.toggle_enable("status", false);
	        frm.toggle_display("patient_first_name", true);
	        frm.toggle_display("patient_middle_name", true);
	        frm.toggle_display("patient_last_name", true);
	        frm.toggle_enable("date_of_birth", true);
	        frm.toggle_enable("policy_number", true);
	        frm.toggle_enable("policy_validity_date", true);
	        frm.toggle_display("user_name_of_the_booking_manager", true);
	        frm.toggle_enable("phone", true);
	        frm.toggle_enable("email", true);
	        frm.toggle_enable("the_reasons_of_the_visit", true);
	        frm.toggle_enable("note_to_booking", true);
	        frm.toggle_enable("agreement_on_the_processing_of_personal_data", true);
	        frm.toggle_display("agreement_on_the_processing_of_personal_data", true);
	        frm.toggle_display("date_and_time_of_the_personal_data_processing_agreement", true);
	        frm.toggle_display("the_user_agreement", true);
	        
	        frm.toggle_reqd("patient_first_name", true);
	        frm.toggle_reqd("patient_middle_name", true);
	        frm.toggle_reqd("patient_last_name", true);
	        frm.toggle_reqd("date_of_birth", true);
	        frm.toggle_reqd("policy_number", true);
	        frm.toggle_reqd("policy_validity_date", true);
	        frm.toggle_reqd("phone", true);
	        frm.toggle_reqd("agreement_on_the_processing_of_personal_data", true);
	    }
	}
})

var form_doctor_name = function(frm){
    var fullname = "";
    if(frm.doc.doctor_first_name){
        fullname += frm.doc.doctor_first_name;
    }
    if(frm.doc.doctor_middle_name){
        fullname += " "+frm.doc.doctor_middle_name;
    }
    if(frm.doc.doctor_last_name){
        fullname += " "+frm.doc.doctor_last_name;
    }
    
    frm.set_value("doctor_full_name", fullname);
}

var form_patient_name = function(frm){
    var fullname = "";
    if(frm.doc.patient_first_name){
        fullname += frm.doc.patient_first_name;
    }
    if(frm.doc.patient_middle_name){
        fullname += " "+frm.doc.patient_middle_name;
    }
    if(frm.doc.patient_last_name){
        fullname += " "+frm.doc.patient_last_name;
    }
    
    frm.set_value("patient_full_name", fullname);
}
