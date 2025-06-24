<template>
    <wwEditorFormRow label="Api group" required>
        <div class="flex items-center">
            <wwEditorInputTextSelect
                class="w-100"
                placeholder="Select an api group"
                required
                :model-value="apiGroupUrl"
                :options="apiGroupsOptions"
                @update:modelValue="setApiGroupUrl"
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
                :disabled="!apiGroupUrl"
            >
                <wwEditorIcon name="refresh" medium />
            </button>
        </div>
    </wwEditorFormRow>
    <div class="flex items-center">
        <div class="w-100 -full">
            <wwEditorFormRow label="Content type">
                <wwEditorInputTextSelect
                    :options="dataTypeOptions"
                    :model-value="dataType"
                    @update:modelValue="setDataType"
                />
            </wwEditorFormRow>
        </div>
    </div>

    <wwEditorInputRow
        label="Headers"
        type="array"
        :model-value="headers"
        :binding-validation="{
            type: 'array',
            tooltip: `An array containing objects formatted as following \`[{ key: 'header-key', value: 'header-value' }]\``,
        }"
        bindable
        @update:modelValue="setHeaders"
        @add-item="setHeaders([...(headers || []), {}])"
    >
        <template #default="{ item, setItem }">
            <wwEditorInputRow
                type="query"
                :model-value="item.key"
                label="Key"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, key: $event })"
            />
            <wwEditorInputRow
                type="query"
                :model-value="item.value"
                label="Value"
                placeholder="Enter a value"
                bindable
                small
                @update:modelValue="setItem({ ...item, value: $event })"
            />
        </template>
    </wwEditorInputRow>
    <wwEditorFormRow>
        <div class="flex items-center">
            <wwEditorInputSwitch
                :model-value="forcedCredentials || (withCredentials && !useStreaming)"
                @update:modelValue="setWithCredentials"
                :disabled="forcedCredentials || useStreaming"
            />
            <div class="body-sm ml-2">Include credentials (cookies)</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                :forced-content="
                    useStreaming
                        ? 'It cannot be set locally here for streamed request, you still can set it globally at the plugin level'
                        : 'Cookies will be sent automatically. Your Xano endpoint API group need to have CORS configured with the proper headers for this to works. </br>1) Access-Control-Allow-Credentials must be true </br>2) Access-Control-Allow-Origin must be set to your editor and production link, not wildcard. </br>[See Xano documentation](https://docs.xano.com/api/the-basics/api-groups#cors-management)</br>'
                "
                class="ml-auto text-stale-500"
            />
        </div>
    </wwEditorFormRow>
    <wwEditorFormRow>
        <div class="flex items-center">
            <wwEditorInputSwitch :model-value="useStreaming" @update:modelValue="setUseStreaming" />
            <div class="body-sm ml-2">Stream response</div>
            <wwEditorQuestionMark
                tooltip-position="top-left"
                forced-content="The response will be streamed in real-time. You can use the stream variable to receive the data. It require the streaming feature to be enabled on your Xano endpoint."
                class="ml-auto text-stale-500"
            />
        </div>
    </wwEditorFormRow>
    <wwEditorInputRow
        v-if="useStreaming"
        label="Stream variable"
        placeholder="Select an array variable"
        type="select"
        :actions="[{ icon: 'plus', label: 'Create variable', onAction: createWwVariable }]"
        :options="wwVariableOptions"
        :model-value="streamVariableId"
        @update:modelValue="setStreamVariableId"
        @action="action => action?.onAction()"
        required
        tooltip="The array variable that will receive the stream data"
    />
    <wwEditorFormRow v-for="(key, index) in legacyParameters" :key="'legacy_param_' + key" :label="key">
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
        <wwEditorInputRow type="query" bindable :model-value="parameters[key]" />
    </wwEditorFormRow>
    <wwEditorInputRow
        v-for="(parameter, index) in endpointParameters"
        :key="'param_' + parameter.name"
        :label="parameter.name"
        type="query"
        placeholder="Enter a value"
        bindable
        :binding-validation="parameter.bindingValidation"
        :required="parameter.required"
        :model-value="parameters[parameter.name]"
        @update:modelValue="setParameters({ ...parameters, [parameter.name]: $event })"
    />

    <wwEditorInputRow
        v-if="endpointBody.length"
        label="Body fields"
        type="select"
        required
        multiple
        :options="bodyFieldOptions"
        :model-value="bodyFields"
        placeholder="All body fields"
        @update:modelValue="setBodyFields"
    />
    <wwEditorFormRow v-for="(key, index) in legacyBody" :key="'legacy_body_' + key" :label="key">
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
            :model-value="body[key]"
            @update:modelValue="setBody({ ...body, [key]: $event })"
        />
    </wwEditorFormRow>
    <wwEditorInputRow
        v-for="(elem, index) in endpointBodyFiltered"
        :key="'body_' + elem.name"
        :label="elem.name"
        :type="elem.type || 'string'"
        placeholder="Enter a value"
        bindable
        :binding-validation="elem.bindingValidation"
        :required="elem.required"
        :model-value="body[elem.name]"
        @update:modelValue="setBody({ ...body, [elem.name]: $event })"
    />

    <wwLoader :loading="isLoading" />
</template>

<script>
export default {
    props: {
        plugin: { type: Object, required: true },
        args: { type: Object, default: () => {} },
    },
    emits: ['update:args'],
    setup() {
        const { website: websiteVariables } = wwLib.wwVariable.useEditorVariables();
        return { websiteVariables };
    },
    data() {
        return {
            isLoading: false,
            spec: null,
            apiGroups: [],
            dataTypeOptions: [
                { label: 'Default (application/json)', value: 'application/json', default: true },
                { label: 'application/x-www-form-urlencoded', value: 'application/x-www-form-urlencoded' },
                { label: 'application/javascript', value: 'application/javascript' },
                { label: 'application/xml', value: 'application/xml' },
                { label: 'multipart/form-data', value: 'multipart/form-data' },
                { label: 'text/plain', value: 'text/plain' },
                { label: 'text/html', value: 'text/html' },
            ],
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
            return this.plugin.xanoManager.fixUrl(this.args.apiGroupUrl);
        },
        endpoint() {
            return this.args.endpoint;
        },
        endpointValue() {
            if (!this.endpoint) return null;
            return `${this.endpoint.method}-${this.endpoint.path}`;
        },
        dataType() {
            return this.args.dataType || null;
        },
        headers() {
            return this.args.headers || [];
        },
        withCredentials() {
            return this.args.withCredentials || false;
        },
        useStreaming() {
            return this.args.useStreaming || false;
        },
        parameters() {
            return this.args.parameters || {};
        },
        bodyFields() {
            return this.args.bodyFields || [];
        },
        body() {
            return this.args.body || {};
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
            return this.plugin.xanoManager.parseSpecEndpointParameters(this.spec, this.endpoint);
        },
        legacyParameters() {
            if (this.isLoading) return [];
            const fields = this.endpointParameters.map(field => field.name);
            return Object.keys(this.parameters).filter(key => !fields.includes(key));
        },
        endpointBody() {
            return this.plugin.xanoManager.parseSpecEndpointBody(this.spec, this.endpoint);
        },
        endpointBodyFiltered() {
            return this.endpointBody.filter(
                item => !this.bodyFields || !this.bodyFields.length || this.bodyFields.includes(item.name)
            );
        },
        legacyBody() {
            if (this.isLoading) return [];
            const fields = this.endpointBody.map(field => field.name);
            return Object.keys(this.body).filter(key => !fields.includes(key));
        },
        bodyFieldOptions() {
            return this.endpointBody.map(item => ({ label: item.name, value: item.name }));
        },
        forcedCredentials() {
            return this.plugin.settings?.publicData.withCredentials;
        },
        streamVariableId() {
            return this.args.streamVariableId;
        },
        wwVariableOptions() {
            return Object.values(this.websiteVariables)
                .filter(variable => variable.type === 'array')
                .map(variable => ({
                    label: variable.name,
                    value: variable.id,
                    icon: 'array',
                }));
        },
    },
    watch: {
        apiGroupUrl() {
            this.refreshSpec();
        },
    },
    methods: {
        setApiGroupUrl(apiGroupUrl) {
            this.$emit('update:args', {
                ...this.args,
                parameters: {},
                body: {},
                bodyFields: [],
                endpoint: null,
                apiGroupUrl,
            });
        },
        setEndpoint(endpoint) {
            const [method, path] = endpoint.split(/-(.+)/);
            this.$emit('update:args', {
                ...this.args,
                parameters: {},
                body: {},
                bodyFields: [],
                endpoint: { method, path },
            });
            this.$nextTick(() => this.setBody({}));
        },
        setHeaders(headers) {
            this.$emit('update:args', { ...this.args, headers });
        },
        setParameters(parameters) {
            this.$emit('update:args', { ...this.args, parameters });
        },
        setBody(body) {
            this.$emit('update:args', { ...this.args, body: this.sanitizeBody({ ...body }) });
        },
        setBodyFields(bodyFields) {
            this.$emit('update:args', { ...this.args, bodyFields });
            this.$nextTick(() => this.setBody(this.body));
        },
        setDataType(dataType) {
            this.$emit('update:args', { ...this.args, dataType });
        },
        setWithCredentials(withCredentials) {
            this.$emit('update:args', { ...this.args, withCredentials });
        },
        setUseStreaming(useStreaming) {
            this.$emit('update:args', { ...this.args, useStreaming });
        },
        setStreamVariableId(streamVariableId) {
            this.$emit('update:args', { ...this.args, streamVariableId });
        },
        removeParam(keys) {
            const parameters = { ...this.parameters };
            for (const key of keys) {
                delete parameters[key];
            }
            this.setParameters({ ...parameters });
        },
        removeBody(keys) {
            const body = { ...this.body };
            for (const key of keys) {
                delete body[key];
            }
            const bodyFields = this.bodyFields.filter(field => !keys.includes(field));
            this.$emit('update:args', { ...this.args, body, bodyFields });
        },
        sanitizeBody(body) {
            const fields = [...this.endpointBodyFiltered.map(f => f.name), ...this.legacyBody];
            for (const bodyKey in body) {
                if (!fields.includes(bodyKey)) {
                    delete body[bodyKey];
                }
            }
            for (const field of fields) {
                body[field] = body[field] || null;
            }

            return body;
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
        createWwVariable() {
            wwLib.wwPopupSidebars.open({ name: 'NAVIGATOR' });
            wwLib.$emit('wwTopBar:navigator:tab', 'data');
            wwLib.$emit('wwTopBar:navigator:data:variables:set', null);
        },
    },
};
</script>
