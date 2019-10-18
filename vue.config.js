module.exports = {
    chainWebpack: config => {
        config.module
            .rule('i18n')
            .resourceQuery(/blockType=i18n/)
            .type('javascript/auto')
            .use('i18n')
            .loader('@kazupon/vue-i18n-loader')
            .end();
        config.module.rule('js').exclude.add(/\.worker\.js$/);
        config.module.rule('ts').exclude.add(/\.worker\.ts$/);
        return config;
    },

    assetsDir: 'static',
    runtimeCompiler: true
};
