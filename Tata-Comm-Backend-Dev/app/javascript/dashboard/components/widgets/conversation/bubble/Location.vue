<template>
  <div class="file message-text__wrap">
    <div class="icon-wrap">
      <fluent-icon icon="location" class="file--icon" size="32" />
    </div>
    <div class="meta">
      <h5 class="text-block-title">
        {{ locationName }}
      </h5>
      <a
        class="download clear link button small"
        rel="noreferrer noopener nofollow"
        target="_blank"
        :href="url"
      >
        {{ $t('CONVERSATION.CLICK_HERE') }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    locationObj: {
      type: Object,
      required: true,
    },
  },
  computed: {
    locationName() {
        console.log('locationObj', this.locationObj)
        if(this.locationObj && this.locationObj['name']) {
            return this.locationObj['name']
        }
        return 'Location Message';
    },
    url() {
        if(this.locationObj && this.locationObj['latitude'] && this.locationObj['longitude']) {
            return `http://maps.google.com/maps?z=12&t=m&q=loc:${this.locationObj['latitude']}+${this.locationObj['longitude']}`;
            // return `https://www.google.com/maps/search/${encodeURI(this.locationObj['name'])}/@${this.locationObj['latitude']},${this.locationObj['longitude']},17z?hl=en&entry=ttu`
        }
        return '<Location>';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~dashboard/assets/scss/variables';

.file {
  display: flex;
  flex-direction: row;
  padding: $space-smaller 0;
  cursor: pointer;

  .icon-wrap {
    font-size: $font-size-giga;
    color: $color-white;
    line-height: 1;
    margin-left: $space-smaller;
    margin-right: $space-slab;
  }

  .text-block-title {
    margin: 0;
    color: $color-white;
    font-weight: $font-weight-bold;
    word-break: break-word;
  }

  .button {
    padding: 0;
    margin: 0;
    color: $color-primary-light;
  }

  .meta {
    padding-right: $space-two;
  }
}
</style>
