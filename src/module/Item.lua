local p = {}

local getArgs = require('Module:Arguments').getArgs
local ItemData = mw.loadData("Module:Item/data")

function getItem(name)
	return ItemData["Items"][name]
end

function p.infobox(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1] or mw.title.getCurrentTitle().text
	local tab = getItem(name)
	return mw.getCurrentFrame():expandTemplate{ title = 'InfoboxItem/template', args = tab }
end

function p.tt(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1]
	local tab = getItem(name)
	return mw.getCurrentFrame():expandTemplate{ title = 'tt/item/template', args = tab }
end

function p.link(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1]
	local tab = getItem(name)
	return mw.getCurrentFrame():expandTemplate{ title = 'LinkItem/template', args = tab }
end

function p.item(frame)
	local args = getArgs(frame)
	local name = args['name'] or args[1]
	local tab = getItem(name)
	return mw.getCurrentFrame():expandTemplate{ title = 'Item/template', args = tab }
end

return p