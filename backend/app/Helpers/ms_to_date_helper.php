<?php
// i created this helper to make datetime printable in the frontend by  turning them from ms to date
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