/*resultData.vue*/
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; color: aliceblue;">result data</th>
          <th style="border: 1px solid #ddd; padding: 8px; color: aliceblue;">value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="featureKey in displayedFeatureKeys" :key="featureKey.name">
          <td style="border: 1px solid #ddd; color: aliceblue;" >
            {{ featureKey.name }}
          </td>
          <td style="border: 1px solid #ddd; color: aliceblue;" v-if="!datamode"> </td>

          <td style="border: 1px solid #ddd; color: aliceblue;" v-else>{{ datamode.variance[idx] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  idx: Number,
  datavalue: Object,
  datamode: Boolean,
});

const displayedFeatureKeys = [
  {name: "variance", value: props.datavalue.variance},
  {name: "mean_region", value: 1},
  {name: "SCR", value: 1},
  {name: "contrast", value: 1},
  {name: "entropy",value: 1},
  {name: "homogeneity",value: 1},
];
</script>