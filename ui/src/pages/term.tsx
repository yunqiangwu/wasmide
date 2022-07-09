import { h, defineComponent, ref } from 'vue';
import { openTer } from '../initTer';

const divRef = ref(null)

export default defineComponent({

    mounted(this) {
        // console.log(divRef.value)
        openTer(divRef.value);
    },

    setup(this) {
        console.log('hello setup!!!');

        const x = ref(0)

        const inc = () => {
            console.log(divRef)
            x.value++;
        };

        return () => (
            <div>
                <div onClick={inc}><div>aaa:</div><div><span>{x.value}</span></div></div>
                <div class="wasm-ter-wrapper">
                    <div ref={divRef} class='wasm-ter-inner'></div>
                </div>
            </div>
        )
    },

})