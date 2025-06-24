 
export default {
    _getApiUrl() {
        return import.meta.env.VITE_APP_API_URL;
    },
    _getPluginsUrl() {
        return import.meta.env.VITE_APP_PLUGINS_URL;
    },
    _getPreviewUrl() {
        const designInfo = wwLib.$store.getters['websiteData/getDesignInfo'];
        if (designInfo.wewebPreviewURL) {
            return designInfo.wewebPreviewURL;
        }

        return import.meta.env.VITE_APP_PREVIEW_URL;
    },
    _getCdnUrl() {
        return import.meta.env.VITE_APP_CDN_URL;
    },
 };
