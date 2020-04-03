module.exports = {
    plugins: [
        require("autoprefixer"),
        require("postcss-font-magician")({
            variants: {
                "Libre Franklin": {
                    "400": [],
                    "700": []
                }
            },
            display: 'swap'
        })
    ]
}