
module.exports = {
    
    loaders: [
        { test: /\.scss$/, loaders: ["style", "css", "sass"] },
    ],
    
    output: {
        filename: "[name].js"
    }

}