const {
    ipcRenderer
} = require('electron')
const path = require('path')
const os = require('os')
const fs = require('fs')

const customTitlebar = require('custom-electron-titlebar')

var titlebar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2C1E42'),
    icon: '../icons/molecule.png',
    unfocusEffect: true,
    titleHorizontalAlignment: 'left'
})

var dir = os.homedir() + "/Molecule/PostOffice"

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
} else {
    console.log("Dir exist")
}

fs.readdir(dir, (err, files) => {
    if (err) {
        console.log(err)
    }
    for (const file of files) {
        fs.unlink(path.join(dir, file), err => {
            if (err) {
                console.log(err)
            }
        })
    }
})

fs.copyFile('\\\\us.ad.lfg.com\\dfs-dept\\ISVSystems\\GIS\\PythonScripts\\PostMan.exe', dir + "\\" + "PostMan.exe", function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Successful")
    }
})



const form = document.getElementById("image-form")
const result = document.querySelector(".output")
var table = document.createElement('table')
var img = document.createElement('img')
var p = document.createElement('p')

function text1() {
    var csv1 = document.getElementById('csv1')
    var selected = document.querySelector(".validate")
    let filepath = csv1.files[0].path
    var name = path.basename(filepath)
    selected.value = name

}

function text2() {
    var csv2 = document.getElementById('csv2')
    var selected = document.querySelectorAll(".validate")[1]
    let filepath = csv2.files[0].path
    var name = path.basename(filepath)
    selected.value = name

}

form.addEventListener('submit', e => {

    var csv1 = document.getElementById('csv1')
    var csv2 = document.getElementById('csv2')
    var prodpath = csv1.files[0].path
    var preprodpath = csv2.files[0].path

    fs.copyFile(prodpath, dir + "\\" + "Prod.csv", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })

    fs.copyFile(preprodpath, dir + "\\" + "PreProd.csv", function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("Successful")
        }
    })



    ipcRenderer.send('PostMan')

    img.src = "Molecule.gif"
    p.textContent = "It will just take few seconds. Please standby!"
    result.appendChild(img)
    result.appendChild(p)
    e.preventDefault()



});


ipcRenderer.on('PostOffice', (e, logs) => {


    try {

        fs.unlinkSync(dir + "/" + "Prod.csv")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "PreProd.csv")
    } catch (e) {


    }

    try {

        fs.unlinkSync(dir + "/" + "PostMan.exe")
    } catch (e) {


    }

    if (result.childElementCount > 0) {
        try {

            result.removeChild(img)
            result.removeChild(p)
            p.innerHTML = ""
            img.innerHTML = ""


        } catch (e) {

        }
    }

    if (logs.err) {

        p.textContent = "Previous run threw error..!! Kindly validate the files selected."

        result.appendChild(p)

    } else {

        if (logs.data == "Empty DataFrame Columns: [Mailbox, Producer] Index: []") {
            p.textContent = "Vola!Check your draft"
        } else {

            p.textContent = logs.data

        }
        result.appendChild(p)

    }


})