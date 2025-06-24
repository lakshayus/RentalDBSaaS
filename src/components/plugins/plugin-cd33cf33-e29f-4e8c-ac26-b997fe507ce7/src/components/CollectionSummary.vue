<template>
    <div class="xano-collection-summary">
        <div class="label-sm content-primary">URL</div>
        <div class="body-sm content-secondary truncate">{{ resolvedUrl || '-' }}</div>
        <div class="label-sm content-primary">Path</div>
        <div class="body-sm content-secondary truncate">{{ config.endpoint?.path || '-' }}</div>
    </div>
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    computed: {
        resolvedUrl() {
            return this.plugin.resolveUrl(this.config.apiGroupUrl);
        },
    },
};
</script>

<style lang="scss" scoped>
.xano-collection-summary {
    display: grid;
    grid-template-columns: 0fr 1fr;
    column-gap: var(--ww-spacing-02);
    row-gap: var(--ww-spacing-02);
}
</style>