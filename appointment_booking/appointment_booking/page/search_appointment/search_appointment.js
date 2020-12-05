frappe.pages['search-appointment'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Search for Open Book Appointment',
		single_column: true
	});

	wrapper = $(wrapper).find('.layout-main-section');

	wrapper.append(`
	<div class="container-fluid">
        <div class="row">
            <div class="user_filters col-md-3"></div>
            <div class="clinic_list col-md-3"></div>
            <div class="clinic_list_data col-md-3"></div>
        </div>
        <div class="row">
            <div class="visibility_from col-md-2"></div>
            <div class="visibility_to col-md-2"></div>
            <div class="app_id col-md-2"></div>
            <div class="clinic_filter col-md-2"></div>
            <div class="doctor_full_name col-md-2"></div>
            <div class="patient_full_name col-md-2"></div>            
        </div>
        <div class="row">
            <div class="step1 row">
                <h1 class="text-center">Step 1</h1>
                <h4 class="text-center">Search by Clinic</h4>
                <div class="col-md-3"></div>
                <div class="clinic_search col-md-6"></div>
                <div class="col-md-3"></div>
                <div style="margin:auto; width: 70%;">
                    <div class="col-md-12">
                        <div class="clinic_limit" style="width:100px; float:left;"></div>
                        <table class="table" style="width:100%; padding:15px;" id="clinic">

                        </table>
                        <button class="btn btn-primary any_clinic" style="float:right;">Next (Any Clinic)</button>
                    </div>
                </div>
            </div>

            <div class="step2 row">
                <h1 class="text-center">Step 2</h1>
                <h4 class="text-center">Search by Medical Specialty (Service)</h4>
                <h5 class="text-center applied_filters_sp"></h5>
                <div class="col-md-3"></div>
                <div class="specialist_search col-md-6"></div>
                <div class="col-md-3"></div>
                <div style="margin:auto; width: 70%;">
                    <div class="col-md-12">
                        <div class="specialist_limit" style="width:100px; float:left;"></div>
                        <table class="table" style="width:100%; padding:15px;" id="specialist">

                        </table>
                        <button class="btn btn-warning move_step_1">Previous</button>
                    </div>
                </div>
            </div>

            <div class="step3 row">
                <h1 class="text-center">Step 3</h1>
                <h4 class="text-center">Search by Doctor's Full Name</h4>
                <h5 class="text-center applied_filters_dc"></h5>
                <div class="col-md-3"></div>
                <div class="doctor_search col-md-6"></div>
                <div class="col-md-3"></div>
                <div style="margin:auto; width: 70%;">
                    <div class="col-md-12">
                        <div class="doctor_limit" style="width:100px; float:left;"></div>
                        <table class="table" style="width:100%; padding:15px;" id="doctor">

                        </table>
                        <button class="btn btn-warning move_step_2">Previous</button>
                        <button class="btn btn-primary any_doctor" style="float:right;">Next (Any Doctor)</button>
                    </div>
                </div>
            </div>

            <div class="step4 row">
                <h1 class="text-center">Step 4</h1>
                <h4 class="text-center">Date Selection</h4>
                <h5 class="text-center applied_filters_dt"></h5>
                <div class="col-md-3"></div>
                <div class="date_search col-md-6"></div>
                <div class="col-md-3"></div>
                <div style="margin:auto; width: 70%;">
                    <div class="col-md-12">
                        <div class="date_limit" style="width:100px; float:left;"></div>
                        <table class="table" style="width:100%; padding:15px;" id="date">

                        </table>
                        <button class="btn btn-warning move_step_3">Previous</button>
                    </div>
                </div>
            </div>

            <div class="step5 row">
                <h1 class="text-center">Step 5</h1>
                <h4 class="text-center">Select the Time of Reception</h4>
                <h5 class="text-center applied_filters_tm"></h5>
                <div style="margin:auto; width: 70%;">
                    <div class="col-md-12">
                        <div class="time_limit" style="width:100px; float:left;"></div>
                        <table class="table" style="width:100%; padding:15px;" id="time">

                        </table>
                        <button class="btn btn-warning move_step_4">Previous</button>
                    </div>
                </div>
            </div>
        </div>
        <div style="padding-bottom:300px;"></div>
    </div>
		`);


    var make_field = function(class_name,fieldtype,label,options,read_only=0){
        page[class_name] = frappe.ui.form.make_control({
            df: {
                fieldtype: fieldtype,
                label: label,
                fieldname: class_name,
                options: options,
                read_only:read_only,
                onchange: () => {
                  // filters[class_name]
                  var value = null;
                  if(fieldtype != "Select"){
                    value = $('input[data-fieldname='+class_name+']').val();
                  }
                  else{
                    value = $("."+class_name).find('.control-value').text();
                    if(class_name == "user_filters"){
                        if(value){
                            frappe.call({
                                method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.get_filter_values",
                                args: {
                                    filter_name :value
                                },
                                callback: function(r) {
                                    const data = r.message;
                                    if(data){
                                        for(var key in data){
                                            filters[key] = data[key]
                                            $('input[data-fieldname='+key+']').val(data[key]);
                                            run();
                                        }
                                        console.log(data)
                                    }
                                }
                            });
                        }
                    }
                    else if(class_name == "clinic_list"){
                        if(value){
                            frappe.call({
                                method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.get_filter_clinic",
                                args: {
                                    filter_name :value
                                },
                                callback: function(r) {
                                    const data = r.message;
                                    console.log(data)
                                    $('[data-fieldname=clinic_list_data]').find('.control-value').html(data);
                                    run();
                                }
                            });
                        }
                        else{
                            $('[data-fieldname=clinic_list_data]').find('.control-value').html("");
                        }
                    }
                  }
                  filters[class_name] = value
                  console.log(filters.active)

                  run(filters.active)
                }
              },
              parent: wrapper.find('.'+class_name),
              render_input: true
          });
    }

    make_field("clinic_search", "Data", "Filter by Clinic")
    make_field("clinic_limit", "Select", "Limit", ['20','50','100','500'])

    make_field("specialist_search", "Data", "Filter by Specialist (Service)")
    make_field("specialist_limit", "Select", "Limit", ['20','50','100','500'])

    make_field("doctor_search", "Data", "Filter by Doctor")
    make_field("doctor_limit", "Select", "Limit", ['20','50','100','500'])

    make_field("date_search", "Date", "Filter by Date")
    make_field("date_limit", "Select", "Limit", ['20','50','100','500'])

    make_field("time_limit", "Select", "Limit", ['20','50','100','500'])

    make_field("visibility_from", "Date", "Visibility From")
    make_field("visibility_to", "Date", "Visibility To")
    make_field("app_id", "Link", "ID", "Appointments")
    make_field("clinic_filter", "Link", "Clinic", "Clinic")
    make_field("doctor_full_name", "Data", "Doctor Full Name")
    make_field("patient_full_name", "Data", "Patient Full Name")

    make_field("clinic_list_data", "Small Text", "Clinic List Data", "",1)
    // $("textarea[data-fieldname='clinic_list_data']").attr("readonly", "true");
    // $("textarea[data-fieldname='clinic_list_data']").attr("height", "auto");

    page.add_inner_button(__("Save Filter"), function() {
        // previous();
        save_filter_fun();
    }).addClass('btn-primary');

    page.add_inner_button(__("Manage Clinic List"), function() {
        frappe.set_route("List", "Clinic List Filters");
    }).addClass('btn-primary');

    var date = frappe.datetime.get_today();
    var y = date.split("-")[0]
    var m = date.split("-")[1]
    var d = date.split("-")[2]
    var date = d+"."+m+"."+y
    $('input[data-fieldname=visibility_from]').val(date);

    var next_week = frappe.datetime.add_days(frappe.datetime.get_today(), 7)
    var y = next_week.split("-")[0]
    var m = next_week.split("-")[1]
    var d = next_week.split("-")[2]
    var next_week = d+"."+m+"."+y
    $('input[data-fieldname=visibility_to]').val(next_week);
    // make_field("clinic", "Link", "Clinic", "Clinic")

    $("[data-fieldname=clinic_limit] option").each(function(){
        if($(this).val()=="20"){
            $(this).attr("selected","selected");
        }
    });

    $("[data-fieldname=specialist_limit] option").each(function(){
        if($(this).val()=="20"){
            $(this).attr("selected","selected");
        }
    });

    $("[data-fieldname=doctor_limit] option").each(function(){
        if($(this).val()=="20"){
            $(this).attr("selected","selected");
        }
    });

    $("[data-fieldname=date_limit] option").each(function(){
        if($(this).val()=="20"){
            $(this).attr("selected","selected");
        }
    });

    $("[data-fieldname=time_limit] option").each(function(){
        if($(this).val()=="20"){
            $(this).attr("selected","selected");
        }
    });

    // var period = $(".period").find('.control-value').text();

    $(document).delegate('.clinic_select', 'click', function(){
        filters["clinic"] = this.getAttribute('data-datatype');
        run();
        console.log(filters["clinic"]);
        hide_display(2);
    });

    $(document).delegate('.specialist_select', 'click', function(){
        filters["specialist"] = this.getAttribute('data-datatype');
        run();
        console.log(filters["specialist"]);
        hide_display(3);
    });

    $(document).delegate('.doctor_select', 'click', function(){
        filters["doctor"] = this.getAttribute('data-datatype');
        run();
        console.log(filters["doctor"]);
        hide_display(4);
    });

    $(document).delegate('.date_select', 'click', function(){
        filters["date"] = this.getAttribute('data-datatype');
        run();
        console.log(filters["date"]);
        hide_display(5);
    });

    $(document).delegate('.time_select', 'click', function(){
        var name = this.getAttribute('data-name');
        frappe.set_route("Form", "Appointments", name);
        // window.open("/desk#Form/Appointments/"+name);
    });


    // $(document).delegate('.save_filter', 'click', function(){
    var save_filter_fun = function(){
        var user_filters = $(".user_filters").find('.control-value').text();
        if(!user_filters){
            frappe.prompt([
                    {
                      fieldname: 'filter_name',
                      fieldtype: 'Data',
                      label: 'Filter Name',
                    }

                  ],
                  function (d) {
                        frappe.call({
                            method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.insert_filter",
                            freeze: true,
                            args: {
                              filter_name : d.filter_name,
                              filters: filters
                            },
                            callback: function(response) {
                                 var r = response.message;
                                 if(r){
                                    // run(me.getAttribute('data-argu'));
                                    make_filters_field(d.filter_name);
                                    frappe.show_alert({
                                        indicator: 'green',
                                        message: 'Filter Added.'
                                    });
                                 }
                            }
                        });
                  },
                  'Enter Filter Name',
                  'Save'
                )
        }
        else{
            frappe.call({
                method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.update_filter",
                freeze: true,
                args: {
                  filter_name : user_filters,
                  filters: filters
                },
                callback: function(response) {
                     var r = response.message;
                     if(r){
                        // run(me.getAttribute('data-argu'));
                        frappe.show_alert({
                            indicator: 'green',
                            message: 'Filter Updated.'
                        });
                     }
                }
            });
        }
    }


    var filters={"app_id": "", "clinic_filter": "", "doctor_full_name": "", "patient_full_name": "","clinic_limit": 20, "specialist_limit": 20, "doctor_limit": 20, "date_limit": 20, "time_limit": 20, "visibility_from": frappe.datetime.get_today(),"visibility_to": frappe.datetime.add_days(frappe.datetime.get_today(), 7)}
    console.log(filters)

    var hide_display = function(step){
        $(".step1").addClass("hide");
        $(".step2").addClass("hide");
        $(".step3").addClass("hide");
        $(".step4").addClass("hide");
        $(".step5").addClass("hide");
        $(".step"+step).removeClass("hide");
        console.log(filters)
    }

    $(".move_step_1").click(function(){
        hide_display(1);
    });

    $(".move_step_2").click(function(){
        hide_display(2);
    });

    $(".move_step_3").click(function(){
        hide_display(3);
    });

    $(".move_step_4").click(function(){
        hide_display(4);
    });

    $(".move_step_5").click(function(){
        hide_display(5);
    });

    $(".any_clinic").click(function(){
        filters["clinic"] = null;
        run();
        console.log(filters["clinic"]);
        hide_display(2);
    });

    $(".any_doctor").click(function(){
        filters["doctor"] = null;
        run();
        console.log(filters["doctor"]);
        hide_display(4);
    });

	var run = function(){
		// get_counts();
        var clinic = filters["clinic"];
        var specialist = filters["specialist"];
        var doctor = filters["doctor"];
        var date = filters["date"];
        if(!clinic){
            clinic = "Any Clinic";
        }
        if(!specialist){
            specialist = "-";
        }
        if(!doctor){
            doctor = "Any Doctor";
        }
        if(!date){
            date = "-";
        }
        var sp = "<b>Clinic: </b>"+clinic;
        var dc = sp+", <b>Specialist: </b>"+specialist;
        var dt = dc+", <b>Doctor: </b>"+doctor;
        var tm = dt+", <b>Date: </b>"+date;
        $(".applied_filters_sp").html(sp);
        $(".applied_filters_dc").html(dc);
        $(".applied_filters_dt").html(dt);
        $(".applied_filters_tm").html(tm);
		frappe.call({
			method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.get_table_data",
	      	args: {
	      		filters: filters
	      	},
			callback: function(r) {
	      		const data = r.message;
				$('#clinic').html(data.clinic);
                $('#specialist').html(data.specialist);
                $('#doctor').html(data.doctor);
                $('#date').html(data.date);
                $('#time').html(data.time);
			}
		});
	}


    var make_filters_field = function(val){
        frappe.call({
            method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.get_user_filters",
            args: {
                
            },
            callback: function(r) {
                const data = r.message;
                // cur_frm.set_df_property("user_filters", "options", data);
                $("div[data-fieldname='user_filters']").remove();
                make_field("user_filters", "Select", "Saved Filters",data)
                $("[data-fieldname=user_filters] option").each(function(){
                    if($(this).val()== val){
                        $(this).attr("selected","selected");
                    }
                });
            }
        });
    }

    var make_clinic_filter = function(){
        frappe.call({
            method: "appointment_booking.appointment_booking.page.search_appointment.search_appointment.get_clinic_filters",
            args: {
                
            },
            callback: function(r) {
                const data = r.message;
                make_field("clinic_list", "Select", "Clinic List", data)
            }
        });
    }

    make_clinic_filter()
    make_filters_field()

    $(window).on('hashchange', function(e){
        var filters={"app_id": "", "clinic_filter": "", "doctor_full_name": "", "patient_full_name": "","clinic_limit": 20, "specialist_limit": 20, "doctor_limit": 20, "date_limit": 20, "time_limit": 20, "visibility_from": frappe.datetime.get_today(),"visibility_to": frappe.datetime.add_days(frappe.datetime.get_today(), 7)}
        console.log("hashchange")
        console.log(filters)
        run();
        hide_display(1);
        // make_filters_field()
        // if(filters["user_filters"]){
        //     $("[data-fieldname=user_filters] option").each(function(){
        //         if($(this).val()== filters["user_filters"]){
        //             $(this).attr("selected","selected");
        //         }
        //     });
        // }
    });

	run();
    hide_display(1);

}