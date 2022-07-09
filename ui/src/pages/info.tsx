import { h, defineComponent, ref } from 'vue';
import styles from './info.module.less'

const divRef = ref(null)

export default defineComponent({

    name: 'InfoPage',

    mounted(this) {
        console.log({
            styles
        })
    },

    setup(this) {
        console.log('hello setup!!!');

        const x = ref(0)

        const inc = () => {
            console.log(divRef)
            x.value++;
        };

        return () => (
            <div class={styles.abc}>
                <div>name: {styles.abc}</div>
                <div onClick={inc}><div>aaa:</div><div><span>{x.value}</span></div></div>
            </div>
        )
    },

})