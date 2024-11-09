<template>
    <div>
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            message: ''
        };
    },
    mounted() {
        axios.get('http://localhost:3000/api/data') // Adjust the URL as necessary
            .then(response => {
                this.message = response.data.message;
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }
};
</script>
