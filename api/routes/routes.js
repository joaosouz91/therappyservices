'use strict';
module.exports = function (app) {
    var messages = require('../controllers/msgController');
    var address = require('../controllers/addressController.js');
    
    // messages Routes
    /*app.route('/messages')
        .get(messages.list_all_messages)
        .post(messages.create_a_message);
    app.route('/messages/:msgId')
        .get(messages.read_a_message)
        .put(messages.update_a_message)
        .delete(messages.delete_a_message);
    */
   
    // address Routes
    app.route('/address/latitudeLongitude')
        .get(address.get_latitude_longitude);
    app.route('/address/distance')
        .get(address.get_distance);
    app.route('/address/complete')
        .get(address.get_complete_address);
};