const check_body = async (body, res) => {
    const isEmpty = body ? Object.values(body).length < 1 : true
    if (isEmpty) {
        res?.status(403).json({ error: "body is required" });
        return false
    }
    return true
}

const find_modules = async (module, req, res) => {
    try {
        const data = await module.find(req.query);
        res?.status(200).json({ success: true, data: data || [] });
        return data
    } catch (error) {
        console.error(error.message);
        res?.status(500).json({ error: error.message });
        return false
    }
}

const find_one_module = async (module, req, res) => {
    const get = req?.query || req.body;
    try {
        const data = await module.findOne(get);
        res?.status(200).json({ success: !!data, data: data || null });
        return data
    } catch (error) {
        console.error(error.message);
        res?.status(500).json({ error: error.message });
        return false
    }
}

const add_module = async (module, req, res) => {
    const body = req?.body || false;
    if (!(await check_body(body, res))) return false;
    try {
        const data = await module.create(req.body);
        res && res?.status(200).json({ success: true, data });
        return data
    } catch (error) {
        const { message } = error;
        res && res?.status(403).json({ success: false, message });
        console.error(message);
        return { success: false, message }
    }
}

const delete_module = async (module, req, res) => {
    const get = req?.query || req.body;
    try {
        const data = await module.deleteOne(get);
        res?.status(200).json({ success: !!data, data: data || null });
        return data
    } catch (error) {
        console.error(error.message);
        res?.status(500).json({ error: error.message });
        return false
    }
}

const get_all_module_names = async (module, req, res) => {
    try {
        const data = await find_modules(module, req)
        const moduleNames = data.map(module => module.name);
        res?.status(200).json({ success: true, data: moduleNames || [] });
        return data
    } catch (error) {
        console.error(error.message);
        res?.status(500).json({ error: error.message });
        return false
    }
};

const get_all_module_id_names = async (module, req, res) => {
    try {
        const data = await module.find(req.query, { name: 1, _id: 1 }).lean();
        res?.status(200).json({ success: true, data: data || [] });
        return data
    } catch (error) {
        console.error(error.message);
        res?.status(500).json({ error: error.message });
        return false
    }
};

const update_module = async (module, methods, req, res) => {
    const { updatedData, ...query } = req.body;
    let can = await check_body(query, res)
    if (!can) return false
    let options = { new: true, upsert: false, runValidators: true };
    try {
        const updatedItem = await module.findOneAndUpdate(query, { [methods]: updatedData }, options);
        res?.status(updatedItem ? 200 : 400).json({ success: Boolean(updatedItem), data: updatedItem || null });
        return updatedItem;
    } catch (error) {
        console.error('Error updating Data:', error.message);
        res?.status(500).json({ success: false, message: 'Error updating Data:', error: error.message });
        return null;
    }
};

const set_activate_module = async (module, req, res) => {
    let { active } = req?.query
    let state = Boolean(active ? JSON.parse(active) : null)
    console.log("state:", state);
    try {
        return await update_module(module, '$set', { body: { ...req?.body, updatedData: { "_active": state } } }, res);
    }
    catch ({ message }) {
        console.log(message);
        res?.status(404).json({ success: false, message, })
    }
}

module.exports = {
    find_modules,
    find_one_module,
    add_module,
    update_module,
    get_all_module_names,
    get_all_module_id_names,
    set_activate_module,
    delete_module
}