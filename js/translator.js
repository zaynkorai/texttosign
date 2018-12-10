var forwardTimeout;
$(document).ready(function () {
    $('#english-text').focus();
    $('.translate-container .english').on("input", function (e) {
        clearTimeout(forwardTimeout);
        forwardTimeout = setTimeout(function () {
            var english = $('#english-text').val();
            var ghetto = translate(english);
            $('#ghetto-text').val(ghetto);
        }, 200);
    });

    $('.translate-container .english').keypress(function (e) {
        if (e.which == 32) {
            var text = $('#english-text').val();
        }
    });

    $('#random-sentence').click(function () {
        $('#english-text').val(randomSentences[Math.floor(randomSentences.length * Math.random())] + " " + randomSentences[Math.floor(randomSentences.length * Math.random())]);
        var english = $('#english-text').val();
        var ghetto = translate(english);
        $('#ghetto-text').val(ghetto);
    });
});