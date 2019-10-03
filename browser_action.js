document.addEventListener('DOMContentLoaded', function () {
    $('button.tablink').on('click', tabChange)
    document.querySelector('#analyze-page').addEventListener('click', downloadContent);
    downloadContent()
});

function downloadContent() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: "analyze_page"
        });
    });
}

function tabChange(event) {
    var tabName = $(event.target).attr('pointerlabel')
    $(".report-container").hide()
    $(`#${tabName}`).show();
    $('button.tablink').removeClass('w3-red');
    $(event.target).addClass('w3-red')
}