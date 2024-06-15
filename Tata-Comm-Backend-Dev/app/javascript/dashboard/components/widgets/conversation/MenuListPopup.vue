<template>
    <div class="column">
        <woot-modal-header :header-title="title" />
        <div class="row modal-content">
            <div class="medium-12 columns menu-buttons-wrap">
                <ul>
                    <li v-for="buttonMain in buttons" :key="buttonMain.title">
                        <span>{{ buttonMain.title }}</span>
                        <ul v-if="buttonMain.rows && buttonMain.rows.length">
                            <li v-for="buttonRow in buttonMain.rows" :key="buttonRow.title">
                                <span>{{ buttonRow.title }}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
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
.menu-buttons-wrap {
    color: initial;
}
</style>
