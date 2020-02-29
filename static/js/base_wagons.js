let ns = {};

ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    // Return the API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/wagony-bazowe',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_read_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        create: function (wagon_name, start_number, end_number, wagon_length, wagon_owner, wagon_type) {
            let ajax_options = {
                type: 'POST',
                url: 'api/wagony-bazowe',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "wagon_name": wagon_name,
                    "start_number": start_number,
                    "end_number": end_number,
                    "wagon_length": wagon_length,
                    "wagon_owner": wagon_owner,
                    "wagon_type": wagon_type
                })
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_create_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        update: function (base_wagon) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/wagony-bazowe/' + base_wagon.nazwa,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(base_wagon)
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_update_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'delete': function (wagon_name) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/wagony-bazowe/' + wagon_name,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_delete_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        }
    };

}());

ns.view = function () {
    'use strict';

    let $wagon_name = $('#wagon_name'),
        $start_number = $('#start_number'),
        $end_number = $('#end_number'),
        $wagon_length = $('#wagon_length'),
        $wagon_owner = $('#wagon_owner'),
        $wagon_type = $('#wagon_type');

    return {
        reset: function () {
            $wagon_name.val('').focus();
            $start_number.val('');
            $end_number.val('');
            $wagon_owner.val('');
            $wagon_length.val('');
            $wagon_type.val('');
        },
        update_editor: function (wagon_name, start_number, end_number, wagon_length, wagon_owner, wagon_type) {
            $wagon_name.val(wagon_name).focus();
            $start_number.val(start_number);
            $end_number.val(end_number);
            $wagon_owner.val(wagon_owner);
            $wagon_length.val(wagon_length);
            $wagon_type.val(wagon_type);
        },
        build_table: function (base_wagon) {
            let rows = '';

            // clear the table
            $('.flex-auto table > tbody').empty();

            // did we get a wagons array?
            if (base_wagon) {
                for (let i = 0, l = base_wagon.length; i < l; i++) {
                    rows += `<tr><td class="wagon_name">${base_wagon[i].wagon_name}</td><td class="start_number">${base_wagon[i].start_number}</td><td class="end_number">${base_wagon[i].end_number}</td><td class="wagon_length">${base_wagon[i].wagon_length}</td><td class="wagon_owner">${base_wagon[i].wagon_owner}</td><td class="wagon_type">${base_wagon[i].wagon_type}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function (error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function () {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}();

ns.controller = (function (m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $wagon_name = $('#wagon_name'),
        $start_number = $('#start_number'),
        $end_number = $('#end_number'),
        $wagon_length = $('#wagon_length'),
        $wagon_owner = $('#wagon_owner'),
        $wagon_type = $('#wagon_type');

    setTimeout(function () {
        model.read();
    }, 100);

    function validate(wagon_name, start_number, end_number, wagon_length, wagon_owner, wagon_type) {
        return wagon_name !== "" && start_number !== "" && end_number !== "" && wagon_length !== "" && wagon_owner !== "" && wagon_type !== "";
    }

    $('#create').click(function (e) {
        let wagon_name = $wagon_name.val(),
            start_number = $start_number.val(),
            end_number = $end_number.val(),
            wagon_length = $wagon_length.val(),
            wagon_owner = $wagon_owner.val(),
            wagon_type = $wagon_type.val();

            e.preventDefault();

        if (validate(wagon_name, start_number, end_number,wagon_length,wagon_owner,wagon_type)) {
            model.create(wagon_name, start_number, end_number,wagon_length,wagon_owner,wagon_type)
        } else {
            alert('Please fill in all form fields');
        }
    });

    $('#update').click(function (e) {
        let wagon_name = $wagon_name.val(),
            start_number = $start_number.val(),
            end_number = $end_number.val(),
            wagon_length = $wagon_length.val(),
            wagon_owner = $wagon_owner.val(),
            wagon_type = $wagon_type.val();

        e.preventDefault();

        if (validate(wagon_name, start_number, end_number,wagon_length,wagon_owner,wagon_type)) {
            model.update(wagon_name, start_number, end_number,wagon_length,wagon_owner,wagon_type)
        } else {
            alert('Please fill in all form fields');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let wagon_name = $wagon_name.val();

        e.preventDefault();

        if (validate(wagon_name, 'placeholder', 'placeholder','placeholder','placeholder','placeholder')) {
            model.delete(wagon_name)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    });

    $('table > tbody').on('dblclick', 'tr', function (e) {
        let $target = $(e.target),
            wagon_name,
            start_number,
            end_number,
            wagon_length,
            wagon_owner,
            wagon_type;

        wagon_name = $target
            .parent()
            .find('td.wagon_name')
            .text();

        start_number = $target
            .parent()
            .find('td.start_number')
            .text();

        end_number = $target
            .parent()
            .find('td.end_number')
            .text();

        wagon_length = $target
            .parent()
            .find('td.wagon_length')
            .text();

        wagon_owner = $target
            .parent()
            .find('td.wagon_owner')
            .text();

        wagon_type = $target
            .parent()
            .find('td.wagon_type')
            .text();


        view.update_editor(wagon_name, start_number, end_number,wagon_length,wagon_owner,wagon_type);
    });

    $event_pump.on('model_read_success', function (e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_update_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_delete_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
