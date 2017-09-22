var cropWidth = 200
var cropHeight = 150
var initialpicwidth = 0
var initialpicheight = 0
var picWidth = 0
var picHeight = 0
var isIE = navigator
    .appVersion
    .indexOf('MSIE') > 0

window.onload = function () {

    var pickbtn = document.getElementById('selectpic')
    var truepic = document.getElementById('truepicture')
    var touchview = document.getElementById('pictureshowid')
    var magnify = document.getElementById('magnify')
    var shrink = document.getElementById('shrink')
    var uploadCroppic = document.getElementById('uploadCroppic')
    magnify.disabled = true
    shrink.disabled = true
    uploadCroppic.disabled = true

    //选择本地图片后
    pickbtn.addEventListener('change', function (e) {
        if (document.getElementById('selectpic').value != '') {
            if (isIE) {
                var url = document
                    .getElementById('selectpic')
                    .value
            } else {
                var url = window
                    .URL
                    .createObjectURL(pickbtn.files[0])
            }
            truepic.setAttribute('src', url)
            magnify.disabled = false
            shrink.disabled = false
            uploadCroppic.disabled = false

        }
    })

    //图片加载到image后
    truepic.addEventListener('load', function (e) {
        //重新加载图片后恢复图片原始大小
        truepic.setAttribute('height', 'auto')
        truepic.setAttribute('width', 'auto')
        //记录图片原始尺寸，计算缩放比例
        initialpicwidth = truepic.width
        initialpicheight = truepic.height
        //设置图片初始缩放位置
        picWidth = truepic.width
        picHeight = truepic.height
        if ((cropHeight - picHeight / (picWidth / cropWidth)) < 0) {
            truepic.setAttribute('width', cropWidth)
            truepic.setAttribute('height', 'auto')
        } else {
            truepic.setAttribute('width', 'auto')
            truepic.setAttribute('height', cropHeight)
        }
        truepic.style.left = '0px'
        truepic.style.top = '0px'

    })

    //在图片预览区域触摸后
    var movelock = false
    var initialX = 0
    var initialY = 0
    var initialpicoffX = 0
    var initialpicoffY = 0
    touchview.addEventListener('mousedown', function (e) {
        movelock = true
        initialX = e.offsetX
        initialY = e.offsetY
        initialpicoffX = truepic.offsetLeft
        initialpicoffY = truepic.offsetTop
    })
    touchview.addEventListener('mousemove', function (e) {
        if (!movelock) {
            return
        }

        var maxoffsetx = cropWidth - truepic.width
        var maxoffsety = cropHeight - truepic.height

        var num = initialpicoffX + (e.offsetX - initialX)
        num = num >= 0 ? 0 : num
        num = num <= maxoffsetx ? maxoffsetx : num
        truepic.style.left = num + 'px'


        var num = initialpicoffY + (e.offsetY - initialY)
        num = num >= 0 ? 0 : num
        num = num <= maxoffsety ? maxoffsety : num
        truepic.style.top = num + 'px'

    })
    touchview.addEventListener('mouseup', function (e) {
        movelock = false
        initialX = 0
        initialY = 0
    })
    touchview.addEventListener('mouseout', function (e) {
        movelock = false
        initialX = 0
        initialY = 0
    })

    //按下放大缩小按钮

    var shrinkfunc = function () {
        //限定缩放最小比例
        var newWidth = truepic.width - 1
        if (newWidth >= cropWidth && newWidth / (truepic.width / truepic.height) >= cropHeight) {
            truepic.setAttribute('width', newWidth)
            truepic.setAttribute('height', 'auto')
            //判断图片偏移位置，超出范围需重定位
            var maxoffsetx = cropWidth - truepic.width
            var maxoffsety = cropHeight - truepic.height
            if (truepic.offsetLeft <= maxoffsetx) {
                truepic.style.left = maxoffsetx + 'px'
            }
            if (truepic.offsetTop <= maxoffsety) {
                truepic.style.top = maxoffsety + 'px'
            }
        }
    }
    var magnifyfunc = function () {
        truepic.setAttribute('width', truepic.width + 1)
        truepic.setAttribute('height', 'auto')
    }
    var intervalId = 0
    magnify.addEventListener('mousedown', function (e) {

        intervalId = setInterval(magnifyfunc, 10)
    })
    shrink.addEventListener('mousedown', function (e) {
        intervalId = setInterval(shrinkfunc, 10)
    })
    magnify.addEventListener('mouseup', function (e) {
        clearInterval(intervalId)
    })
    shrink.addEventListener('mouseup', function (e) {
        clearInterval(intervalId)
    })
    magnify.addEventListener('mouseout', function (e) {
        clearInterval(intervalId)
    })
    shrink.addEventListener('mouseout', function (e) {
        clearInterval(intervalId)
    })

    //上传裁剪数据
    uploadCroppic.addEventListener('mousedown', function () {
        var cropedHeight = cropHeight * (initialpicheight / truepic.height)
        var cropedWidth = cropWidth * (initialpicwidth / truepic.width)
        var cropedScale = truepic.width / initialpicwidth
        var positionX = Math.abs(truepic.offsetLeft / cropedScale)
        var positionY = Math.abs(truepic.offsetTop / cropedScale)
        var cropData = [positionX, positionY, cropedWidth, cropedHeight, cropWidth, cropHeight]
        var fd = new FormData()
        fd.append('cropData', cropData)
        fd.append('cropData2', cropData)
        fd.append('picture', pickbtn.files[0])
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.responseText === 'ok') {
                    alert('图片裁剪上传成功')
                }
            }
        }
        xhr.open('post', 'http://localhost:3000', true)
        xhr.send(fd)
        console.log(fd)
    })


}