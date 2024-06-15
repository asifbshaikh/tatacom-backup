<template>
    <div class="column">
        <woot-modal-header :header-title="title" />
        <div class="row modal-content">
            <div class="medium-12 columns">
                    <pre>
                        <code class="menu-code">
                            {{JSON.stringify(buttons)}}
                        </code>
                    </pre>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        buttons: {
            type: Object,
            required: true,
        },
    },
};
</script>
<style lang="scss" scoped>
::v-deep .ProseMirror-woot-style {
    height: 8rem;
}
.menu-code {
    white-space: initial;
}
</style>
