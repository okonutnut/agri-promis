'use server';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function GetUserRole() {
    const supabase = createClient();
    const { data: user } = await (await supabase).auth.getUser();

    if (user) {
        const { data: userRole } = await (await supabase).from('user_profile').select('*').eq('id', user.user?.id).single();
        switch (userRole?.role) {
            case 'admin':
                redirect('/dashboard/admin');
            case 'field_technician':
                redirect('/dashboard/field-technician');
            case 'agriculturist':
                redirect('/dashboard/agriculturist');
            default:
                redirect('/login');
        }
    }
    else {
        redirect('/login');
    }
}

export async function IsUserExist() {
    const supabase = createClient();
    const { data: user } = await (await supabase).auth.getUser();

    if (user) {
        return true;
    }
    return false;
}