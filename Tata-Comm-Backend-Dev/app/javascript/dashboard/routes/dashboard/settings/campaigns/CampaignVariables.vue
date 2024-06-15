<template>
  <!-- <div class="day-wrap">
    <div class="checkbox-wrap"> -->
        <label :class="{ error: $v.variableVal.$error }">
           {{ `${variable.type} ${typeof variable.format !== 'undefined' ? `(${variable.format}) ` : ''}- \{\{${variable.key}\}\}` }}
           <!-- {{ variable.key }} -->
           <select v-model="variableVal" @change="variableValChange($event)">
             <option v-for="item in contactFields" :key="item" :value="item">
               {{ item }}
             </option>
           </select>
        </label>
    <!-- </div>
  </div> -->
</template>

<script>
import { required } from 'vuelidate/lib/validators';
// import parse from 'date-fns/parse';
// import differenceInMinutes from 'date-fns/differenceInMinutes';
// import { generateTimeSlots } from '../helpers/businessHour';

// const timeSlots = generateTimeSlots(30);

export default {
  components: {},
  props: {
    variable: {
      type: Object,
      default: () => ({
        key: '',
      }),
      required: true,
    },
    contactRecords: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
        variableVal: null,
    }
  },
  validations() {
    return {
        variableVal: {
            required,
        }
    }
  },
  computed: {
    contactFields() {
        let contactFieldsList = [];
        console.log("variablevariable", this.variable)
        console.log("contactRecordscontactRecords", this.contactRecords)
        if((typeof this.contactRecords !== "undefined") && (typeof this.contactRecords[0] !== "undefined") && this.contactRecords[0]){
            const validKeys = (typeof this.variable.format !== 'undefined') ? [] : ["name", "phone_number", "email"]
            console.log("variableKeysAllowed", this.variable, this.contactRecords, validKeys)
            const contactRecordsFirst = this.contactRecords[0];
            Object.keys(contactRecordsFirst).forEach(function(key) {
                if((typeof contactRecordsFirst[key] !== "object") && validKeys.includes(key)) {
                    contactFieldsList.push(key);
                } else if (["additional_attributes", "custom_attributes"].includes(key)) {
                    Object.keys(contactRecordsFirst[key]).forEach(function(keyChild) {
                        if(typeof contactRecordsFirst[key][keyChild] !== "object") {
                            contactFieldsList.push(keyChild);
                        }
                    });
                }
            });
        }
        console.log(contactFieldsList);
        return contactFieldsList;
    },
  },
    // variableVal: {
    //   get() {
    //     return '';
    //   },
    //   set(value) {
    //     this.$emit('update', value);
    //   },
    // },
  methods: {
    variableValChange() {
        this.$emit('update', this.variableVal);
    },
  }
};
</script>
<style lang="scss" scoped>
// .day-wrap::v-deep .multiselect {
//   margin: 0;
//   width: 12rem;
// }
// .day-wrap {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: var(--space-small) 0;
//   min-height: var(--space-larger);
//   box-sizing: content-box;
//   border-bottom: 1px solid var(--color-border-light);
// }

// .checkbox-wrap {
//   display: flex;
//   align-items: center;
// }

.label {
  font-size: var(--font-size-mini);
  color: var(--w-700);
  background: var(--w-50);
}

.error {
  font-size: var(--font-size-mini);
  color: var(--r-300);
}
</style>
