<template>
    <div :class="['form-wrap', {'flex-col-reverse': (labelStyle === 'vertical')}, {'flex-row-reverse gap-2': (labelStyle === 'horizontal')}]">
        <template v-if="['text', 'email', 'number'].includes(baseType)">
            <input 
                :id="labelFor" 
                v-bind="$attrs" 
                :type="baseType" 
                v-model="content" 
                :data-size="size" 
                @input="handleInput" 
                :placeholder="placeholder" 
                :class="['peer', {'form-element': !disableInputClass}, {'has-value': (content !== '')}, overrideInputClass]" 
            />
        </template>
        <template v-if="['area'].includes(baseType)">
            <textarea 
                v-model="content" 
                @input="handleInput" 
                :placeholder="placeholder"
                :class="['peer', {'form-input': !disableInputClass}, {'has-value': (content !== '')}, overrideInputClass]"
            ></textarea>
        </template>
        <label 
            :for="labelFor" 
            :data-size="size" 
            v-if="labelFor !== '' && labelName !== ''" 
            :class="[
                'inline-block tracking-wide cursor-pointer transition-all', 
                {'vertical': (labelStyle === 'vertical')}, 
                {'whitespace-nowrap': (labelStyle === 'horizontal')}, 
                {'top-1 peer-focus:-top-2.5 peer-[.has-value]:-top-2.5': (size === 'sm')}, 
                {'top-1.5 peer-focus:-top-3 peer-[.has-value]:-top-3': (size === 'md')}, 
                {'top-[0.9rem] peer-focus:-top-2 peer-[.has-value]:-top-2': (size === 'lg')}, 
                {'absolute left-3.5 z-[2] data-[size=sm]:text-sm data-[size=md]:text-base data-[size=lg]:text-lg/4 peer-focus:bg-transparent peer-focus:backdrop-blur-sm peer-[.has-value]:bg-transparent peer-[.has-value]:backdrop-blur-sm': (labelStyle === 'floated')}
            ]" 
        >{{ labelName }}</label>
    </div>
</template>

<script setup>
    import { ref, defineEmits, onMounted } from 'vue';

    // labelStyle: 'vertical|horizontal|floated'
    const props = defineProps({
        baseType: {
            type: String,
            default: 'text'
        },
        labelFor: {
            type: String,
            required: false
        },
        labelName: {
            type: String,
            required: false
        },
        disableInputClass: {
            type: Boolean,
            default: false
        },
        overrideInputClass: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'md'
        },
        labelStyle: {
            type: String,
            default: 'vertical'
        },
        value: {
            type: String, 
            default: ''
        },
        placeholder: {
            type: String,
            required: false
        }
    });
    
    const content = ref('');
    const emit = defineEmits(['update:modelValue']);

    function handleInput() {
        emit('update:modelValue', content.value);
    }

    onMounted(() => {
        // console.log(props.value, props.value !== '');
        if (props.value !== '') content.value = props.value;
    });
</script>