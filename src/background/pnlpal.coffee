import message from "./message.js"
import setting from "./setting.js"

shareOnPnlpal = (title, link) ->
    popupWidth = 1024
    popupHeight = 700

    chrome.windows.getCurrent null, ({top, left, width, height}) ->
        if width < popupWidth
            popupLeft = (screen.width / 2) - (popupWidth / 2);
        else #calculate top and left position
            popupLeft = ((width / 2) - (popupWidth / 2)) + left
        
        if height < popupWidth
            popupTop = ((screen.height / 2) - (popupHeight / 2)) + top
        else
            popupTop = ((height / 2) - (popupHeight / 2)) + top
        
        if link.includes('youtube.com') and link.includes('v=')
            cid = 5
            title = title.replace ' - YouTube', ''
        else 
            cid = 1
        url = "https://pnlpal.dev/compose?cid=#{cid}&title=#{encodeURIComponent(title)}&link=#{encodeURIComponent(link)}"

        chrome.windows.create {
            url,
            type: 'popup',
            width: popupWidth,
            height: popupHeight,
            top: Math.round(popupTop),
            left: Math.round(popupLeft)
        }

openYtbOnCaptionz = (link) ->
    url = "https://pnlpal.dev/captionz?link="+encodeURIComponent(link)

    chrome.tabs.create {
        url
    }


export default {
    shareOnPnlpal,
    openYtbOnCaptionz,
    init: () ->
        message.on 'share with pals', ({ title, link })->
            shareOnPnlpal title, link

        message.on 'setting of ytb captionz', () ->
            return { disableYtbCaptionz: setting.getValue("disableYtbCaptionz") }

        message.on 'open ytb video on captionz', ({ link })->
            if link.startsWith "https://www.youtube.com/watch"
                openYtbOnCaptionz link 
}