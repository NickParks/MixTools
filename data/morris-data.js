$(function () {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2018-02-04 12:00:00',
            viewers: 10,
        }, {
            period: '2018-02-04 12:05:00',
            viewers: 22,
        }, {
            period: '2018-02-04 12:10:00',
            viewers: 18
        }, {
            period: '2018-02-04 12:15:00',
            viewers: 16
        }, {
            period: '2018-02-04 12:20:00',
            viewers: 20
        }, {
            period: '2018-02-04 12:25:00',
            viewers: 13
        }, {
            period: '2018-02-04 12:30:00',
            viewers: 15
        }, {
            period: '2018-02-04 12:35:00',
            viewers: 17
        }, {
            period: '2018-02-04 12:40:00',
            viewers: 15
        }, {
            period: '2018-02-04 12:45:00',
            viewers: 7
        }],
        xkey: 'period',
        ykeys: ['viewers'],
        labels: ['viewers'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
});