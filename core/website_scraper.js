const colors = require('colors')
const fs = require('fs')

const changeDir = (dir) => {
    return process.chdir(dir)
}


const createFolder = async (response, Host) => {

    const websiteDir = `${Host.hostname}`

    if (!fs.existsSync(websiteDir)) {

        fs.mkdirSync(websiteDir)
        process.chdir(`./${websiteDir}`)

        fs.mkdirSync('content')

        extractBody(response, Host)
    } else {
        return console.log(`::: 🔴 ${response.url} folder already exists.`.red)
    }

}


const extractBody = async (response, Host) => {
    await fs.writeFileSync('index.html', `${response.body}`)
    console.log('\n:: Extracted html file from website.🗃️'.green)

    extractJS()
}


const extractJS = async () => {

    const htmlContent = fs.readFileSync('index.html', 'utf-8');

    const regex = /src="(.+\.js)"/g
    const matches = []

    while (m = regex.exec(htmlContent)) {
        await matches.push(m[1])
    }

    console.log(`\n:: Found ${matches.length} javascript file(s)🗒️`.yellow)

    changeDir('./content')

    matches.forEach(async (data) => {
        fs.appendFileSync('js_files.txt', data + '\n', 'utf-8', function(err) {
            if(err) {return console.log(err)}
        })
    })

    console.log(':: Saved all javascript files URLs on js_files.txt📂'.green)

    extractCSS()
}


const extractCSS = async () => {

    changeDir(`../`)

    const htmlContent = fs.readFileSync('index.html', 'utf-8');

    const regex = /href="(.+\.css)"/g
    const matches = []

    while (m = regex.exec(htmlContent)) {
        await matches.push(m[1])
    }

    console.log(`\n:: Found ${matches.length} css file(s)🗒️`.yellow)

    changeDir('./content')

    matches.forEach(async (data) => {
        fs.appendFileSync('css_files.txt', data + '\n', 'utf-8', function(err) {
            if(err) {return console.log(err)}
        })
    })

    console.log(':: Saved all css files URLs on css_files.txt📂'.green)

    console.log('\n::: 🟢 Process Finished.🗃️'.cyan)
}

module.exports = createFolder