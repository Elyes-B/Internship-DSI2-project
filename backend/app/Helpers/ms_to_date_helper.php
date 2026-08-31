<?php

if (! function_exists('ms_to_date')) {
    function ms_to_date($ms, string $format = 'Y-m-d H:i:s'): string
    {
        if (empty($ms) || ! is_numeric($ms)) {
            return '';
        }

        return date($format, (int) ($ms / 1000));
    }
}
?>