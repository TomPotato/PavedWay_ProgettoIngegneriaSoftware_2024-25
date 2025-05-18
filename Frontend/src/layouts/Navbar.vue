<template>
    <div class="navbar bg-primary px-4 text-font">
        <div class="flex-1">
            <RouterLink to="/" class="flex items-center text-xl font-bold">
                <img src="/logo.png" alt="Logo" class="h-20 mr-[-1em]" />
                <span>- PAVED WAY -</span>
            </RouterLink>
        </div>
        <div>
            <ul class="menu flex items-center menu-horizontal px-1">
                <li>
                    <RouterLink to="/">Home</RouterLink>
                </li>
                <li>
                    <RouterLink to="/sites">Cantieri</RouterLink>
                </li>
                <li>
                    <RouterLink to="/login">Login</RouterLink>
                </li>
                <li>
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full">
                                <img alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul tabindex="0"
                            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li><a class="justify-between"> Profile<span class="badge">New</span></a></li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'Navbar' });
</script>