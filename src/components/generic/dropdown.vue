<template>
  <div class="dashb-dropdown-wrapper">
    <div @click="showDropdown"
         v-click-outside:shouldShowDropdown="showDropdown.bind(showDropdown,'shouldShowDropdown')"
         class="dashb-dropdown">
      <div class="dashb-dropdown-selection">
        <div class="dashb-dropdown-text"
             v-if="selectedOption">
          <span>{{ selectedOption.name }}</span>
        </div>
        <div class="dashb-dropdown-text"
             v-else>
          <span>{{ config.defaultValue }}</span>
        </div>
      </div>
      <div
          v-bind:class="{'dashb-dropdown-dropdown-arrow-open':shouldShowDropdown}"
          class="dashb-dropdown-dropdown-arrow">
        <div class="button-icon dsb-triangle-down">
        </div>
      </div>
    </div>
    <div class="dashb-dropdown-anchor">
      <div v-bind:class="{'dashb-dropdown-absolute-open':shouldShowDropdown}"
           class="dashb-dropdown-absolute">
        <div v-bind:class="{'dashb-dropdown-contents-open':shouldShowDropdown}"
             class="dashb-dropdown-contents">
          <div
              class="dashb-dropdown-item"
              @click="selectOption(null)">
            <div class="dashb-dropdown-item-selection">
              <div class="dashb-dropdown-item-text">
                <span>{{ config.defaultValue }} </span>
              </div>
            </div>
          </div>
          <div v-for="option in options" v-if="options.length > 0"
               class="dashb-dropdown-item"
               @click="selectOption(option)">
            <div class="dashb-dropdown-item-selection">
              <div class="dashb-dropdown-item-text">
                <span>{{ option[config.text] }} </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 A generic dropdown component
 Events:
 -optionChange : Emitted when an option is selected
 **/
export default {
  props: {
    config: {
      //List of items that will be iterated and used as dropdown items
      options: Object,
      //Default value of the dropdown
      defaultValue: 'String',
      //Property key to use as value for each entry in the dataset
      value: 'String',
      //Property key to use as displayed text for each entry in the dataset
      text: 'String',
    }
  },
  data: () => {
    return {
      options: [],
      selectedOption: null,
      shouldShowDropdown: false,
      _clickOutside: {
        dropdown: null
      }
    }
  },
  watch: {
    config: function () {
      this.options = this.config.options ?? []

    }
  },
  created: function () {
    this.options = this.config.options ?? []
  },
  methods: {
    showDropdown: function () {
      this.shouldShowDropdown = !this.shouldShowDropdown;
    },
    selectOption: function (option) {
      this.selectedOption = option;

      //Notify parent for option change
      this.$emit('optionChange', this.selectedOption)
    }
  },
  directives: {
    /*
     Vue directive for detecting clicks outside the dropdown
     in order to close it and maintain only one dropdown open at a time
     */
    clickOutside: {
      componentUpdated: function (el, binding, vnode) {
        setTimeout(() => {
          const handler = (e) => {
            if (!el.contains(e.target) && el !== e.target && vnode.context.$data[binding.arg]) {
              binding.value(e);
            }
          };
          if (vnode.context.$data[binding.arg]) {
            if (vnode.context.$data._clickOutside[binding.arg] == null) {
              vnode.context.$data._clickOutside[binding.arg] = handler;
              document.addEventListener('click', vnode.context.$data._clickOutside[binding.arg]);
            }
          } else {
            document.removeEventListener('click', vnode.context.$data._clickOutside[binding.arg]);
            vnode.context.$data._clickOutside[binding.arg] = null;
          }
        }, 100);
      },
      unbind: function (el, binding, vnode) {
        document.removeEventListener('click', vnode.context.$data._clickOutside[binding.arg]);
        vnode.context.$data._clickOutside[binding.arg] = null;
      }
    }
  },
  name: "dropdown"
}
</script>

<style scoped>

.dashb-dropdown-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  flex-direction: column;
}

.dashb-dropdown {
  width: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #1BC5BD;
  border-radius: 4px;
  cursor: pointer;
  background: #1BC5BD;
}

.button-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  font-size: 12px;
  padding-right: 12px;
  margin: 0 4px;
}

.dashb-dropdown-text {
  display: flex;
  padding: 8px 13px 8px 13px;
  user-select: none;
  overflow: hidden;

}

.dashb-dropdown-text > span {
  line-height: 16px;
  color: #FFFFFF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 15.5em;

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: right;
}

.dashb-dropdown-selection {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
}

.dashb-dropdown-dropdown-arrow, .dashb-dropdown-dropdown-arrow > i {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 16px;
  height: 16px;
}

.dashb-dropdown-dropdown-arrow {
  margin-right: 4px;
  margin-left: 8px;
}

.dashb-dropdown-dropdown-arrow > i {
  font-size: 16px;
  color: #1BC5BD;
}

.dashb-dropdown-dropdown-arrow-open > i {
  transform: rotateZ(-180deg);
}

.dashb-dropdown-anchor {
  position: relative;
  width: 100%;
}

.dashb-dropdown-absolute {
  position: absolute;
  width: 100%;
  z-index: 10;
  top: 4px;
  transition: padding-top 0s 0.4s;
  background: #1BC5BD;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.19);
}

.dashb-dropdown-absolute-open {
  top: 4px;
  border-radius: 4px;
  overflow: hidden;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 2px;
  transition: padding-top 0s;
}

.dashb-dropdown-contents::-webkit-scrollbar {
  width: 8px;
  background: #128f8c;
}

.dashb-dropdown-contents::-webkit-scrollbar-thumb {
  background: #128f8c;
}

.dashb-dropdown-contents::-webkit-scrollbar-thumb:hover {
  background: #128f8c;
}

.dashb-dropdown-contents {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  max-height: 0;
  width: 100%;
  overflow: hidden;
  flex-direction: column;
  transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);
  scrollbar-width: thin;

}


.dashb-dropdown-contents-open {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  max-height: 300px;
}


.dashb-dropdown-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  transition: background-color 0.25s ease-in-out;
}

.dashb-dropdown-item:hover {
  background: #128f8c;
  cursor: pointer;
}

.dashb-dropdown-item-selection {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

}


.dashb-dropdown-item-text {
  display: flex;
  padding: 8px 0px 8px 13px;
  user-select: none;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: #FFFFFF;
}

.dashb-dropdown-item-text > span {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: right;
}

</style>
