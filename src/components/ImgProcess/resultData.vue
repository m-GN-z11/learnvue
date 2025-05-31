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

          <td style="border: 1px solid #ddd; color: aliceblue;" v-else>{{ featureKey.value[idx] }}</td>
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
  {name: "mean_region", value: props.datavalue.mean_region},
  {name: "SCR", value: props.datavalue.SCR},
  {name: "contrast", value: props.datavalue.contrast},
  {name: "entropy",value: props.datavalue.entropy},
  {name: "homogeneity",value: props.datavalue.homogeneity},
];
</script>