module.exports = {
    apps: [
        {
            name: 'Jav4Free API',
            exec_mode: 'cluster',
            instances: 'max',
            script: 'jav4free.js'
        }
    ]
}