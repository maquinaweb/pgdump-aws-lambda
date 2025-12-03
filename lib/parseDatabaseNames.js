/**
 * Parse database names from config.PGDATABASE
 * Supports format: "dbname" or "dbname:alias" for custom S3 path names
 * Examples:
 *   - "mydb" -> { dbname: "mydb", alias: "mydb" }
 *   - "mydb:custom" -> { dbname: "mydb", alias: "custom" }
 *   - "db1,db2:custom,db3" -> [{ dbname: "db1", alias: "db1" }, { dbname: "db2", alias: "custom" }, { dbname: "db3", alias: "db3" }]
 */
function parseDatabaseNames(config) {
    if (!config.PGDATABASE) {
        throw new Error("PGDATABASE was not provided")
    }
    // we support two types of string:
    //  a) single database name e.g. "dbone"
    //  b) multiple database names e.g. "dbone, dbtwo"
    //  c) database name with alias e.g. "dbone:myalias"
    const entries = config.PGDATABASE.split(",").map(s => s.trim()).filter(s => s)

    const seen = new Set()
    const result = []

    for (const entry of entries) {
        const [dbname, alias] = entry.split(":").map(s => s.trim())
        const key = `${dbname}:${alias || dbname}`

        if (!seen.has(key)) {
            seen.add(key)
            result.push({
                dbname,
                alias: alias || dbname
            })
        }
    }

    return result
}

module.exports = parseDatabaseNames
