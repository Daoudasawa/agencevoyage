<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsContactInfo extends Model
{
    use HasFactory;

    protected $table = 'cms_contact_info';

    protected $fillable = [
        'key',
        'value',
    ];
}
