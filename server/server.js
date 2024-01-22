const { createClient } = require("@supabase/supabase-js")
const { projectUrl, serviceKey } = require("../config.json")

const supabase = createClient(projectUrl, serviceKey )

module.exports = { supabase }