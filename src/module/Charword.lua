local p = {}

local getArgs = require('Module:Arguments').getArgs

function getCharword(name)
  local query = {
    ['_id'] = {['$regex'] = 'Data:Charword\\.tab'},
    ['name'] = name
  }
  local result = mw.huiji.db.findOne(query)
  return result
end

function p.charword(frame)
  local args = getArgs(frame)
  local pagename = args['name'] or args[1] or mw.title.getCurrentTitle().text
  local name = string.gsub(pagename, '/语音互动$', '')
  local tab = getCharword(name)
  return mw.getCurrentFrame():expandTemplate {title = 'CharWord/template', args = tab}
end

return p