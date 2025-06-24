<template>
    <wwEditorFormRow label="Api group" required>
        <div class="flex items-center">
            <wwEditorInputTextSelect
                class="w-100"
                placeholder="Select an api group"
                required
                :model-value="api.apiGroupUrl"
                :options="apiGroupsOptions"
                @update:modelValue="setProp('apiGroupUrl', $event)"
            />
            <button type="button" class="ww-editor-button -primary -small -icon ml-2" @click="refreshManager">
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>
    </wwEditorFormRow>
    <wwEditorFormRow label="Endpoint" required>
        <div class="flex items-center">
            <wwEditorInputTextSelect
                class="w-100"
                placeholder="Select an endpoint"
                required
                :model-value="endpointValue"
                :options="endpointsOptions"
                @update:modelValue="setEndpoint"
            />
            <button
                type="button"
                class="ww-editor-button -primary -small -icon ml-2"
                @click="refreshSpec"
                :disabled="!api.apiGroupUrl"
            >
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>
    </wwEditorFormRow>
    <wwEditorInputRow
        label="Headers"
        type="array"
        :model-value="api.headers"
        :bindable="collection.mode === 'dynamic'"
        @update:modelValue="setProp('headers', $event)"
        @add-item="setProp('headers', [...(api.headers || []), {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                small
                :bindable="collection.mode === 'dynamic'"
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                small
                :bindable="collection.mode === 'dynamic'"
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorFormRow>
        <div class="flex items-center">
            <wwEditorInputSwitch
                :model-value="forcedCredentials || api.withCredentials"
                @update:modelValue="setProp('withCredentials', $event)"
                :disabled="forcedCredentials"
            />
            <div class="body-sm ml-2">Include credentials (cookies)</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="Cookies will be sent automatically. Your Xano endpoint API group need to have CORS configured with the proper header for this to works. 1) Access-Control-Allow-Credentials must be true, 2) Access-Control-Allow-Origin must be set to your editor and production link, not wildcard. [See Xano documentation](https://docs.xano.com/api/the-basics/api-groups#cors-management)"
                class="ml-auto text-stale-500"
            />
        </div>
    </wwEditorFormRow>
    <wwEditorFormRow v-for="(key, index) in legacyParameters" :key="index" :label="key">
        <template #append-label>
            <div class="flex items-center justify-end w-full body-3 text-red-500">
                This parameter doesn't exist anymore
                <button
                    type="button"
                    class="ww-editor-button -icon -small -tertiary -red ml-1"
                    @click="removeParam([key])"
                >
                    <wwEditorIcon small name="trash" />
                </button>
            </div>
        </template>
        <wwEditorInputRow type="query" bindable :model-value="api.parameters[key]" />
    </wwEditorFormRow>
    <wwEditorInputRow
        v-for="(parameter, index) in endpointParameters"
        :key="index"
        :label="parameter.name"
        type="query"
        placeholder="Enter a value"
        :bindable="collection.mode === 'dynamic'"
        :binding-validation="parameter.bindingValidation"
        :required="parameter.required"
        :model-value="api.parameters[parameter.name]"
        @update:modelValue="setProp('parameters', { ...api.parameters, [parameter.name]: $event })"
    />

    <wwEditorFormRow v-for="(key, index) in legacyBody" :key="index" :label="key">
        <template #append-label>
            <div class="flex items-center justify-end w-full body-3 text-red-500">
                This field doesn't exist anymore
                <button
                    type="button"
                    class="ww-editor-button -icon -small -tertiary -red ml-1"
                    @click="removeBody([key])"
                >
                    <wwEditorIcon small name="trash" />
                </button>
            </div>
        </template>
        <wwEditorInputRow
            type="query"
            bindable
            :model-value="api.body[key]"
            @update:modelValue="setProp('body', { ...api.body, [key]: $event })"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        v-for="(elem, index) in endpointBody"
        :key="index"
        :label="elem.name"
        :type="elem.type || 'string'"
        placeholder="Enter a value"
        :bindable="collection.mode === 'dynamic'"
        :binding-validation="elem.bindingValidation"
        :required="elem.required"
        :model-value="api.body[elem.name]"
        @update:modelValue="setProp('body', { ...api.body, [elem.name]: $event })"
    />

    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        collection: { type: Object, required: true },
        config: { type: Object, required: true },
    },
    emits: ['update:config'],
    data() {
        return {
            isLoading: false,
            apiGroups: [],
            spec: null,
        };
    },
    mounted() {
        if (this.plugin.xanoManager.hasFailed()) {
            wwLib.wwNotification.open({
                text: 'Failed to init Xano, please ensure your API key has the permission required.',
                color: 'red',
            });
            return;
        }
        this.isLoading = true;
        this.plugin.xanoManager.onReady(async () => {
            this.apiGroups = this.plugin.xanoManager.getApiGroups();
            await this.refreshSpec();
            this.isLoading = false;
        });
    },
    computed: {
        apiGroupUrl() {
            // Ensure old api group value still match even if base domain has changed
            return this.plugin.xanoManager.fixUrl(this.config.apiGroupUrl);
        },
        api() {
            return {
                endpoint: null,
                headers: [],
                withCredentials: false,
                parameters: {},
                body: {},
                ...this.config,
                apiGroupUrl: this.apiGroupUrl,
            };
        },
        endpointValue() {
            if (!this.api.endpoint) return null;
            return `${this.api.endpoint.method}-${this.api.endpoint.path}`;
        },
        apiGroupsOptions() {
            return this.apiGroups.map(apiGroup => ({
                label: apiGroup.name,
                value: apiGroup.api,
            }));
        },
        endpointsOptions() {
            return this.plugin.xanoManager.parseSpecEndpoints(this.spec);
        },
        endpointParameters() {
            return this.plugin.xanoManager.parseSpecEndpointParameters(this.spec, this.api.endpoint);
        },
        endpointBody() {
            return this.plugin.xanoManager.parseSpecEndpointBody(this.spec, this.api.endpoint);
        },
        legacyParameters() {
            if (this.isLoading) return [];
            const fields = this.endpointParameters.map(field => field.name);
            return Object.keys(this.api.parameters).filter(key => !fields.includes(key));
        },
        legacyBody() {
            if (this.isLoading) return [];
            const fields = this.endpointBody.map(field => field.name);
            return Object.keys(this.api.body).filter(key => !fields.includes(key));
        },
        forcedCredentials() {
            return this.plugin.settings?.publicData.withCredentials;
        },
    },
    watch: {
        apiGroupUrl() {
            this.refreshSpec();
        },
    },
    methods: {
        setProp(key, value) {
            this.$emit('update:config', { ...this.api, [key]: value });
        },
        setEndpoint(endpoint) {
            const [method, path] = endpoint.split(/-(.+)/);
            this.setProp('endpoint', { method, path });
        },
        removeParam(keys) {
            const parameters = { ...this.api.parameters };
            for (const key of keys) {
                delete parameters[key];
            }
            this.setProp('parameters', parameters);
        },
        removeBody(keys) {
            const body = { ...this.api.body };
            for (const key of keys) {
                delete body[key];
            }
            this.setProp('body', body);
        },
        async refreshManager() {
            try {
                this.isLoading = true;
                await this.plugin.xanoManager.init();
                this.apiGroups = this.plugin.xanoManager.getApiGroups();
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
        async refreshSpec() {
            if (!this.apiGroupUrl) return;
            try {
                this.isLoading = true;
                this.spec = await this.plugin.xanoManager.fetchApiGroupSpec(this.apiGroupUrl);
            } catch (err) {
                wwLib.wwLog.error(err);
            } finally {
                this.isLoading = false;
            }
        },
    },
};
</script>
