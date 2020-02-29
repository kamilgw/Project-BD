// Create namespace
let ns = {};

// Create model instance
ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    // Return API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/podsumowanie',
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
        }
    };

}());

// Create view instance
ns.view = (function () {
    'use strict';

    // Return the API
    return {
        build_table: function (podsumowanie) {
            let rows = '',
                temp;

            // clear the table
            $('.flex-auto table > tbody').empty();

            if (podsumowanie) {
                for (let i = 0, l = podsumowanie.length; i < l; i++) {
                    console.log(temp);
                    rows += `<tr><td class="firma">${podsumowanie[i].firma}</td><td class="czas_calkowity">${podsumowanie[i].czas_calkowity}</td><td class="koszt">${podsumowanie[i].koszt}</td></tr>`;
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
}());

// Create controller
ns.controller = (function (m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body');

    setTimeout(function () {
        model.read();
    }, 100);

    $event_pump.on('model_read_success', function (e, data) {
        view.build_table(data);
    });

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
