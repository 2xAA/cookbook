<script setup>
import { prettyFractions } from "~/utils/pretty-fractions";
const props = defineProps(["quantity", "units"]);
</script>

<template>
  {{ prettyFractions(quantity) }}{{ units.length > 2 ? ` ${units}` : units }}
</template>
