<template>
    <div class="column">
        <woot-modal-header :header-title="title" />
        <div class="row modal-content">
            <div class="medium-12 columns">
                <template v-for="buttonMain in buttons">
                    <pre>
                        <code class="menu-code">
                            {{JSON.stringify(buttonMain)}}
                        </code>
                    </pre>
                </template>
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
            type: Array,
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
